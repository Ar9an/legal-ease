import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import App from './LegalEaseAnalyzer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
=======
import App from './App'
import { AuthProvider } from './AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
>>>>>>> 87e4da6 (initial commit)
  </StrictMode>,
)
