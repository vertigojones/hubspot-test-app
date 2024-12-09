import axios from "axios"

export const handleHubspotApiData = async () => {
  const userKey = process.env.REACT_APP_HUBSPOT_USER_KEY

  console.log(userKey)

  if (!userKey) {
    console.error("User key is not defined in environment variables.")
    return
  }

  try {
    // Fetch data from the GET request
    const { data } = await axios.get(
      `https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=${userKey}`
    )

    // Deconstruct the two endpoint arrays
    const { existingAssociations, newAssociations } = data

    console.log(existingAssociations)
    console.log(newAssociations)
  } catch (error) {
    console.error("Error fetching data from HubSpot API:", error)
  }
}
