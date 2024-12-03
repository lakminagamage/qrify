import Link from 'next/link'
import { Github, Linkedin, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-gray-800 border-gray-700">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-col items-center justify-center">
        <div className="flex space-x-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub profile</span>
            </Link>
          </Button>
        </div>
        <p className="text-sm text-gray-400 flex items-center">
          Developed with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Lakmina Pramodya Gamage 2024
        </p>
      </div>
    </footer>
  )
}

