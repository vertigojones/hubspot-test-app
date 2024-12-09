import styled from "styled-components"
import { FC, useEffect } from "react"
import { handleHubspotApiData } from "../util/handle-hubspot-api-data"

type ApiPageProps = {}

const ApiPageContainer = styled.div`
  /* Add styles here if needed */
`

const ApiPage: FC<ApiPageProps> = () => {
  useEffect(() => {
    handleHubspotApiData() // Call the function to fetch and log data
  }, []) // Empty dependency array ensures this runs on component mount

  return <ApiPageContainer>Hello World</ApiPageContainer>
}

export default ApiPage
