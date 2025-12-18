import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import PageContainer from './components/PageContainer'

import Home from './screens/Home'
import About from './screens/About'
import AuditForm from './screens/AuditForm'
import ResultsScreen from './screens/ResultsScreen'
import NotFound from './screens/NotFound'

// Wrapper component to provide navigation to AuditForm
function AuditFormWrapper() {
  const navigate = useNavigate()

  function handleResults(results) {
    navigate('/results', { state: { results } })
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
          <Route path="/audit" element={<AuditFormWrapper />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  )
}

export default App
