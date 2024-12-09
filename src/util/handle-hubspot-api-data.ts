import axios from "axios"

const MAX_COMPANY_ROLE_LIMIT = 5
const MAX_CONTACT_COMPANY_ROLE_LIMIT = 2

interface Association {
  companyId: number
  contactId: number
  role: string
}

interface ValidationResult {
  validAssociations: Association[]
  invalidAssociations: (Association & { failureReason: string })[]
}

const userKey = process.env.REACT_APP_HUBSPOT_USER_KEY

export const handleHubspotApiData = async () => {
  if (!userKey) {
    console.error("User key is not defined in environment variables.")
    return
  }

  try {
    // Fetch the test dataset
    const testDataset = await axios.get(
      `https://candidate.hubteam.com/candidateTest/v3/problem/test-dataset?userKey=${userKey}`
    )
    console.log("Test Dataset:", testDataset.data)

    const { existingAssociations, newAssociations } = testDataset.data

    const companyRoleCounts: Record<string, number> = {}
    const contactCompanyCounts: Record<string, number> = {}
    const tempValidAssociations: Association[] = []

    // Initialize counts with existing associations
    existingAssociations.forEach(
      ({ companyId, contactId, role }: Association) => {
        const companyRoleKey = `${companyId}-${role}`
        const contactCompanyKey = `${contactId}-${companyId}`

        companyRoleCounts[companyRoleKey] =
          (companyRoleCounts[companyRoleKey] || 0) + 1
        contactCompanyCounts[contactCompanyKey] =
          (contactCompanyCounts[contactCompanyKey] || 0) + 1
      }
    )

    const validAssociations: Association[] = []
    const invalidAssociations: (Association & { failureReason: string })[] = []

    const invalidateContributingAssociations = (
      companyId: number,
      role: string,
      contactId: number
    ) => {
      // Invalidate all temporary associations for company-role pair
      tempValidAssociations
        .filter(
          (assoc) =>
            assoc.companyId === companyId &&
            (assoc.role === role || assoc.contactId === contactId)
        )
        .forEach((assoc) => {
          invalidAssociations.push({
            ...assoc,
            failureReason: "WOULD_EXCEED_LIMIT",
          })
        })

      // Remove invalidated associations from tempValidAssociations
      tempValidAssociations.splice(
        0,
        tempValidAssociations.length,
        ...tempValidAssociations.filter(
          (assoc) =>
            assoc.companyId !== companyId ||
            (assoc.role !== role && assoc.contactId !== contactId)
        )
      )
    }

    // Process new associations dynamically
    newAssociations.forEach((association: Association) => {
      const { companyId, contactId, role } = association

      const companyRoleKey = `${companyId}-${role}`
      const contactCompanyKey = `${contactId}-${companyId}`

      // Check if the association already exists
      const alreadyExists = existingAssociations.some(
        (existing: Association) =>
          existing.companyId === companyId &&
          existing.contactId === contactId &&
          existing.role === role
      )

      if (alreadyExists) {
        invalidAssociations.push({
          ...association,
          failureReason: "ALREADY_EXISTS",
        })
        return
      }

      // Temporarily classify as valid and project counts
      const projectedCompanyRoleCount =
        (companyRoleCounts[companyRoleKey] || 0) + 1
      const projectedContactCompanyCount =
        (contactCompanyCounts[contactCompanyKey] || 0) + 1

      if (
        projectedCompanyRoleCount > MAX_COMPANY_ROLE_LIMIT ||
        projectedContactCompanyCount > MAX_CONTACT_COMPANY_ROLE_LIMIT
      ) {
        // Invalidate all contributing associations for the exceeded limit
        invalidateContributingAssociations(companyId, role, contactId)

        invalidAssociations.push({
          ...association,
          failureReason: "WOULD_EXCEED_LIMIT",
        })
      } else {
        // Update counts and classify as valid
        companyRoleCounts[companyRoleKey] = projectedCompanyRoleCount
        contactCompanyCounts[contactCompanyKey] = projectedContactCompanyCount
        validAssociations.push(association)
        tempValidAssociations.push(association)
      }
    })

    const resultBody: ValidationResult = {
      validAssociations,
      invalidAssociations,
    }

    console.log(
      "Generated Result for Test Dataset:",
      JSON.stringify(resultBody, null, 2)
    )

    // Fetch the correct answer for comparison
    const correctAnswer = await axios.get(
      `https://candidate.hubteam.com/candidateTest/v3/problem/test-dataset-answer?userKey=${userKey}`
    )
    console.log("Correct Answer:", JSON.stringify(correctAnswer.data, null, 2))

    const isEqual =
      JSON.stringify(resultBody) === JSON.stringify(correctAnswer.data)
    console.log("Is Generated Result Correct:", isEqual)

    // Submit the results
    const response = await axios.post(
      `https://candidate.hubteam.com/candidateTest/v3/problem/test-result?userKey=${userKey}`,
      resultBody
    )

    console.log("Test Result POST Response:", response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message)
    } else {
      console.error("Unexpected error:", error)
    }
  }
}
