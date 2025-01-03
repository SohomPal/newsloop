'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SignUpModal } from './signup-modal'

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { data: session } = useSession()
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  if (!session) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80 z-50 flex items-center justify-center">
          <Card className="w-[90%] max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign in Required</CardTitle>
              <CardDescription>
                Please sign in to access this feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create an account to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Customize your news preferences</li>
                <li>Save articles for later</li>
                <li>Get personalized recommendations</li>
                <li>Sync across all your devices</li>
              </ul>
              <Button 
                onClick={() => setShowSignUpModal(true)} 
                className="w-full"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <SignUpModal 
          isOpen={showSignUpModal} 
          onClose={() => setShowSignUpModal(false)} 
        />
      </div>
    )
  }

  return <>{children}</>
}

