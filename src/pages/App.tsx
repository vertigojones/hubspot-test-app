import styled from "styled-components"
import { FC, useEffect } from "react"
import { handleHubspotApiData } from "../util/handle-hubspot-api-data"

type ApiPageProps = {}

const ApiPageContainer = styled.div`
  /* Add styles here if needed */
`

const ApiPage: FC<ApiPageProps> = () => {
  useEffect(() => {
    handleHubspotApiData() // Fetch and log data
  }, [])

  return <ApiPageContainer>Hello World</ApiPageContainer>
}

export default ApiPage
