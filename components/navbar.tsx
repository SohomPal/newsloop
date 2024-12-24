'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import SignUpModal from '@/components/signup-modal'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const pathname = usePathname()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Preferences', path: '/preferences' },
    { name: 'Saved Articles', path: '/saved' },
    { name: 'About', path: '/about' },
  ]

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`hover:text-primary transition-colors ${
            pathname === item.path ? 'text-primary font-semibold' : ''
          }`}
        >
          {item.name}
        </Link>
      ))}
    </>
  )

  return (
    <nav className="border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-2xl font-bold">
            NewsLoop
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsSignUpOpen(true)} variant="secondary" className="bg-white text-blue-600 hover:bg-blue-100">Sign Up</Button>
          <ModeToggle />
        </div>
      </div>
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </nav>
  )
}

export default Navbar
