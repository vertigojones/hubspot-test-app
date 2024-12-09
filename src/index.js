import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ApiPage from "./pages/App.tsx"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ApiPage />
  </React.StrictMode>
)

reportWebVitals()
