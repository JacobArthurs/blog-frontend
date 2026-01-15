import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="flex flex-col items-center gap-4">
        <SearchX size={64} className="text-muted-foreground" />
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground text-center">
          Page not found
        </p>
      </div>
      <Button asChild variant="outline">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default NotFound
