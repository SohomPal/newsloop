import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord  } from 'react-icons/fa';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const handleGoogleSignIn = async () => {
    // console.log('Sign in with Google');
    await signIn('google'); // Redirects to homepage after successful sign-in
  };

  const handleDiscordSignIn = async () => {
    // console.log('Sign in with Discord');
    await signIn('discord'); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Sign Up or Sign In</DialogTitle>
          <DialogDescription>
            Choose your preferred method to create an account or sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline"
            className="flex items-center justify-center gap-3 h-12 px-4 py-2 hover:bg-secondary transition-colors"
          >
            <FcGoogle className="h-6 w-6" />
            <span className="font-semibold">Sign in with Google</span>
          </Button>
          <Button 
            onClick={handleDiscordSignIn} 
            variant="outline"
            className="flex items-center justify-center gap-3 h-12 px-4 py-2 hover:bg-secondary transition-colors"
          >
            <FaDiscord  className="h-6 w-6" />
            <span className="font-semibold">Sign in with Discord</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

