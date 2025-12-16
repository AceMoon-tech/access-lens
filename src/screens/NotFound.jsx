import { Link } from 'react-router-dom'
import Button from '../components/Button'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-surface-1 rounded-sm p-24">
      <h1 className="text-3xl font-semibold text-default mb-24">
        404
      </h1>

      <h2 className="text-2xl font-semibold text-default mb-24">
        Page Not Found
      </h2>

      <p className="text-muted text-base mb-32 max-w-content">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/">
        <Button variant="primary" size="md">
          Go Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
