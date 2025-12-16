import Header from './Header'
import PageContainer from './PageContainer'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-default text-default">
      <Header />

      {/* Main landmark for screen readers */}
      <main id="main-content" role="main">
        <PageContainer>
          {children}
        </PageContainer>
      </main>
    </div>
  )
}

export default Layout
