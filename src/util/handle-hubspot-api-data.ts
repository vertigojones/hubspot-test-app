import axios from "axios"

export const handleHubspotApiData = async () => {
  const userKey = process.env.REACT_APP_HUBSPOT_USER_KEY

  console.log(userKey)

  if (!userKey) {
    console.error("User key is not defined in environment variables.")
    return
  }

  try {
    const response = await axios.get(
      `https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=${userKey}`
    )
    console.log("HubSpot API Data:", response.data)
  } catch (error) {
    console.error("Error fetching data from HubSpot API:", error)
  }
}
