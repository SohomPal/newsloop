import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SignUpOverlayProps {
  onClose: () => void
  onSignUp: () => void
}

export function SignUpOverlay({ onClose, onSignUp }: SignUpOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[90%] max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Get Personalized News</CardTitle>
          <CardDescription>
            Sign up now to receive news tailored to your interests and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create an account to unlock:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Personalized news feed based on your interests</li>
            <li>Save articles to read later</li>
            <li>Custom news categories and topics</li>
            <li>Daily news digest delivered to your inbox</li>
          </ul>
          <div className="flex gap-4 pt-4">
            <Button onClick={onSignUp} className="flex-1">
              Sign Up Now
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Reading
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

