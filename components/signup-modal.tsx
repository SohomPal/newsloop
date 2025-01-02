import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChromeIcon as Google, ComputerIcon as Microsoft } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleMicrosoftSignIn = () => {
    console.log('Sign in with Microsoft');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Up or Sign In</DialogTitle>
          <DialogDescription>
            Choose your preferred method to create an account or sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2">
            <Google className="h-5 w-5" />
            Sign in with Google
          </Button>
          <Button onClick={handleMicrosoftSignIn} className="flex items-center justify-center gap-2">
            <Microsoft className="h-5 w-5" />
            Sign in with Microsoft
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
