import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'


function NotFound() {
  return (
    <PageContainer>
      <Card className="space-y-24 text-center">
        <h1 className="text-3xl font-semibold text-default">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-default">
          Page Not Found
        </h2>

        <p className="text-muted text-base max-w-content mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <Button variant="primary" size="md">
            Go Home
          </Button>
        </Link>
      </Card>
    </PageContainer>
  )
}

export default NotFound
