import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm">
            &copy; {currentYear} Jacob Arthurs. All rights reserved.
          </p>
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/jacobarthurs/blog-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="h-4 w-4" />
              View Source
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
