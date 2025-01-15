'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

async function getUser(email: string | null | undefined) {
  if (!email) return null;
  
  try {
    const response = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default function Redirect() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserAndRedirect() {
      if (status === 'loading') return; // Wait for the session to load

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const userData = await getUser(session.user.email);
          
          if (userData && userData.user) {
            if (userData.user.newUser) {
              router.push('/onboarding');
            } else {
              router.push('/');
            }
          } else {
            console.error('User data not found or invalid');
            router.push('/'); // Redirect to home if user data is not found or invalid
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/'); // Redirect to home on error
        }
      } else if (status === 'unauthenticated') {
        router.push('/'); // Redirect to home if no session
      }
      
      setIsLoading(false);
    }

    fetchUserAndRedirect();
  }, [session, status, router]);

  useEffect(() => {
    console.log('Session data:', session);
  }, [session, status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return null; // Render nothing once loading is complete (redirect will have occurred)
}

