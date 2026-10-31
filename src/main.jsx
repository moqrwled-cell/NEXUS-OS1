import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import ContractCompare from './pages/ContractCompare.jsx'
import ContractGuardDemo from './pages/ContractGuardDemo.jsx'
import Welcome from './pages/Welcome.jsx'
import LanguageWrapper from './components/LanguageWrapper.jsx'
import './i18n'
import './index.css'

// Lazy-load WarRoom so its outreach engine and 20,000 lead database are NEVER bundled into public landing assets
const WarRoom = React.lazy(() => import('./pages/WarRoom.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageWrapper>
        <React.Suspense fallback={<div className="min-h-screen bg-[#020608]" />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/demo" element={<ContractGuardDemo />} />
            <Route path="/contractguard-demo" element={<ContractGuardDemo />} />
            <Route path="/war-room" element={<WarRoom />} />
            <Route path="/nexus-hq" element={<WarRoom />} />
            <Route path="/secret-ops" element={<WarRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/app/contractcompare" element={<ContractCompare />} />
            {/* Redirect legacy and unused routes cleanly to ContractGuard */}
            <Route path="/hub" element={<Navigate to="/app/contractcompare" replace />} />
            <Route path="/app/*" element={<Navigate to="/app/contractcompare" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </LanguageWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
