import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import PageContainer from './components/PageContainer'
import AuditErrorBoundary from './components/AuditErrorBoundary'

import Home from './screens/Home'
import About from './screens/About'
import AuditForm from './screens/AuditForm'
import ResultsScreen from './screens/ResultsScreen'
import NotFound from './screens/NotFound'

// Wrapper component to provide navigation to AuditForm
function AuditFormWrapper() {
  const navigate = useNavigate()

  function handleResults(auditResponse) {
    // Navigate with audit_id in URL (from server persistence)
    navigate(`/results/${auditResponse.audit_id}`, { 
      // Also pass results for immediate display (until server persistence is implemented)
      // TODO: Remove results from state once getAuditById() is fully implemented
      state: { results: auditResponse.results }
    })
  }

  return <AuditForm onResults={handleResults} />
}

function App() {
  return (
    <BrowserRouter>
      {/* Header is OUTSIDE PageContainer */}
      <Header />

      {/* Page content only */}
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/audit" 
            element={
              <AuditErrorBoundary>
                <AuditFormWrapper />
              </AuditErrorBoundary>
            } 
          />
          <Route 
            path="/results/:auditId" 
            element={
              <AuditErrorBoundary>
                <ResultsScreen />
              </AuditErrorBoundary>
            } 
          />
          <Route 
            path="/results" 
            element={
              <AuditErrorBoundary>
                <ResultsScreen />
              </AuditErrorBoundary>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  )
}

export default App
