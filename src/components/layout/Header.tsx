import { Link } from 'react-router-dom'
import { Globe, Linkedin, Github, Rss, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useTheme } from '@/contexts/theme'
import Logo from '@/components/Logo'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === 'light' ? (
                  <p>Switch to Dark Mode</p>
                ) : (
                  <p>Switch to Light Mode</p>
                )}
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6!" />

            {/* Social Links */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://jacobarthurs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Personal Website</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://linkedin.com/in/jacobarthurs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>LinkedIn</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://github.com/jacobarthurs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6!" />

            {/* RSS Feed */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://api.jacobarthurs.com/blog-api/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Rss className="h-5 w-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>RSS Feed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}

export default Header
