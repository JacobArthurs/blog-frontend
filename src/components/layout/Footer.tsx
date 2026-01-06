import { Github, Briefcase, Linkedin, Rss } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Social Links (Mobile) */}
          <TooltipProvider>
            <div className="flex md:hidden items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" asChild>
                    <a
                      href="https://jacobarthurs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Briefcase size={20} className="size-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Personal Website</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" asChild>
                    <a
                      href="https://linkedin.com/in/jacobarthurs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin size={20} className="size-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>LinkedIn</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" asChild>
                    <a
                      href="https://github.com/jacobarthurs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} className="size-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" asChild>
                    <a
                      href="https://api.jacobarthurs.com/blog-api/rss.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Rss size={20} className="size-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>RSS Feed</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

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
