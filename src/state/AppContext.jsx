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

/**
 * Normalize cached audit envelope.
 * New shape: { auditId: string, results: object }
 * Legacy results-only payloads are treated as unrestorable (return null).
 */
function normalizeCachedAudit(value) {
  if (!value || typeof value !== 'object') return null
  const auditId = value.auditId
  const results = value.results
  if (typeof auditId !== 'string' || !auditId.trim()) return null
  if (!results || typeof results !== 'object') return null
  return { auditId, results }
}

// Load audit results from localStorage
function loadCachedAuditFromStorage() {
  try {
    const cached = localStorage.getItem(AUDIT_RESULTS_CACHE_KEY)
    if (cached) {
      return normalizeCachedAudit(JSON.parse(cached))
    }
  } catch (error) {
    console.warn('Failed to load audit results from cache:', error)
  }
  return null
}

// Save audit results to localStorage
function saveCachedAuditToStorage(cachedAudit) {
  try {
    const normalized = normalizeCachedAudit(cachedAudit)
    if (normalized) {
      localStorage.setItem(AUDIT_RESULTS_CACHE_KEY, JSON.stringify(normalized))
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
  
  // Cached audit: { auditId, results } | null — hydrated from localStorage
  const [cachedAudit, setCachedAuditState] = useState(() => {
    return loadCachedAuditFromStorage()
  })
  
  // Wrapper that also saves to localStorage
  const setCachedAudit = useCallback((next) => {
    const normalized = normalizeCachedAudit(next)
    setCachedAuditState(normalized)
    saveCachedAuditToStorage(normalized)
  }, [])
  
  // Hydrate from cache on mount (in case cache was updated externally)
  useEffect(() => {
    const cached = loadCachedAuditFromStorage()
    if (cached && !cachedAudit) {
      setCachedAuditState(cached)
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
    // Cached audit session ({ auditId, results } | null)
    cachedAudit,
    setCachedAudit,
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
