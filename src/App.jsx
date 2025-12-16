import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import PageContainer from './components/PageContainer'
import Header from './components/Header'

import Home from './screens/Home'
import About from './screens/About'           // ✅ ADD THIS
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
      <PageContainer>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />          {/* ✅ NEW ROUTE */}
          <Route path="/audit" element={<AuditFormWrapper />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  )
}

export default App
