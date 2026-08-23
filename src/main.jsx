import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import LeadScrub from './pages/LeadScrub.jsx'
import ClientDashboard from './pages/ClientDashboard.jsx'
import ProductLanding from './pages/ProductLanding.jsx'
import AuthLogin from './pages/AuthLogin.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LanguageWrapper from './components/LanguageWrapper.jsx'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageWrapper>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/leadscrub" element={<LeadScrub />} />
          <Route path="/access/:productId" element={<ClientDashboard />} />
          <Route path="/product/:productId" element={<ProductLanding />} />
        </Routes>
      </LanguageWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
