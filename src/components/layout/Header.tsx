import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Linkedin,
  Github,
  Rss,
  Moon,
  Sun,
  Search
} from 'lucide-react'
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
import SearchModal from '@/components/SearchModal'

function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo className="h-9 w-9 hover:fill-primary transition-colors ease-in-out duration-200" />
          </Link>

          {/* Search Button */}
          <Button
            onClick={() => setIsSearchOpen(true)}
            className="border border-input bg-background hover:bg-background cursor-text w-xs justify-start hidden md:flex"
          >
            <Search size={20} className="text-muted-foreground size-5" />
            <span className="text-sm text-muted-foreground">
              Search blog posts and tags...
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Search Button (Mobile) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  variant="ghost"
                  className="inline-flex md:hidden cursor-pointer"
                >
                  <Search size={20} className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search</p>
              </TooltipContent>
            </Tooltip>

            {/* Social Links */}
            <div className="hidden md:flex items-center gap-1">
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

            <Separator orientation="vertical" className="h-6!" />

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="cursor-pointer"
                >
                  {theme === 'light' ? (
                    <Moon size={20} className="size-5" />
                  ) : (
                    <Sun size={20} className="size-5" />
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
          </TooltipProvider>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  )
}

export default Header
