import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './LegalEaseAnalyzer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
