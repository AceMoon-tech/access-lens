import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext(null)

// Audit lifecycle state enum
export const AuditLifecycle = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

// localStorage key for audit results cache
const AUDIT_RESULTS_CACHE_KEY = 'access-lens-audit-results'

// Load audit results from localStorage
function loadAuditResultsFromCache() {
  try {
    const cached = localStorage.getItem(AUDIT_RESULTS_CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn('Failed to load audit results from cache:', error)
  }
  return null
}

// Save audit results to localStorage
function saveAuditResultsToCache(results) {
  try {
    if (results) {
      localStorage.setItem(AUDIT_RESULTS_CACHE_KEY, JSON.stringify(results))
    } else {
      localStorage.removeItem(AUDIT_RESULTS_CACHE_KEY)
    }
  } catch (error) {
    console.warn('Failed to save audit results to cache:', error)
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [auditLifecycle, setAuditLifecycle] = useState(AuditLifecycle.IDLE)
  
  // Audit form state
  const [auditFormInputs, setAuditFormInputs] = useState({
    uiDescription: '',
    copyBlocks: '',
  })
  
  // Audit results state - initialize from localStorage cache
  const [auditResults, setAuditResultsState] = useState(() => {
    return loadAuditResultsFromCache()
  })
  
  // Wrapper for setAuditResults that also saves to localStorage
  const setAuditResults = useCallback((results) => {
    setAuditResultsState(results)
    saveAuditResultsToCache(results)
  }, [])
  
  // Hydrate from cache on mount (in case cache was updated externally)
  useEffect(() => {
    const cached = loadAuditResultsFromCache()
    if (cached && !auditResults) {
      setAuditResultsState(cached)
    }
  }, []) // Only run on mount

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // Update audit form inputs
  const updateAuditFormInputs = useCallback((updates) => {
    setAuditFormInputs((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  // Clear audit form inputs
  const clearAuditFormInputs = useCallback(() => {
    setAuditFormInputs({
      uiDescription: '',
      copyBlocks: '',
    })
  }, [])

  const value = {
    theme,
    toggleTheme,
    user,
    setUser,
    loading,
    setLoading,
    auditLifecycle,
    setAuditLifecycle,
    AuditLifecycle,
    // Audit form state
    auditFormInputs,
    updateAuditFormInputs,
    clearAuditFormInputs,
    // Audit results state
    auditResults,
    setAuditResults,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}






