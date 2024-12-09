import axios from "axios"

export const handleHubspotApiData = async () => {
  try {
    const response = await axios.get("https://api.hubspot.com/your-endpoint")
    console.log("HubSpot API Data:", response.data)
  } catch (error) {
    console.error("Error fetching data from HubSpot API:", error)
  }
}
