import axios from "axios"

const MAX_COMPANY_ROLE_LIMIT = 5 // Max roles per company-role pair
const MAX_CONTACT_COMPANY_ROLE_LIMIT = 2 // Max roles per contact-company pair

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
    // Fetch data
    const { data } = await axios.get(
      `https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=${userKey}`
    )

    // Deconstruct the two endpoint arrays
    const { existingAssociations, newAssociations } = data

    // Track counts for limits
    const companyRoleCounts: Record<string, number> = {}
    const contactCompanyRoleCounts: Record<string, number> = {}

    // 3. Populate counts from the existing associations
    // - Iterate through existing associations and update the tracking structures.

    // 4. Validate new associations
    // - For each new association:
    //   - Check if the association already exists (failureReason: "ALREADY_EXISTS").
    //   - Check if the addition would exceed limits for:
    //     - (companyId, role)
    //     - (contactId, companyId)
    //   - Classify each association as 'valid' or 'invalid' with the appropriate failure reason.

    // 5. Prepare the validation result
    // - Create an object with arrays of 'valid' and 'invalid' associations.

    // 6. Send the validation results back to the API
    // - Use a POST request to submit the result object.

    // 7. Log or handle the response
    // - Log the response or handle it as needed for further processing.

    // Go to the pub
  } catch (error) {
    console.error("Error fetching data from HubSpot API:", error)
  }
}
