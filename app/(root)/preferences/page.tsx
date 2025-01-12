'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthCheck } from '@/components/auth-check'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useToast } from '@/hooks/use-toast'


export default function Preferences() {
  const { data: session } = useSession()
  const [interests, setInterests] = useState(["Sports", "Business", "Technology", "Travel", "Nation", "Entertainment", "Politics", "Health"])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchPreferences() {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/preferences?email=${encodeURIComponent(session.user.email)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            const data = await response.json()
            console.log('Response:', data)
            setSelectedInterests(data.preferences || [])
          } else {
            console.error('Failed to fetch preferences')
            toast({
              title: "Error",
              description: "Failed to fetch preferences. Please try again.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error fetching preferences:', error)
          toast({
            title: "Error",
            description: "An error occurred while fetching preferences.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchPreferences()
  }, [session, toast])

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          preferences: selectedInterests,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "Your preferences have been updated.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update preferences.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating preferences.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              {session?.user?.image ? (
                <AvatarImage
                  src={session.user.image}
                  alt={session?.user?.name || 'User'}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{session?.user?.name || 'Welcome'}</CardTitle>
              <p className="text-muted-foreground">Customize your news experience</p>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="interests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="interests">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Interests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                          className="cursor-pointer text-sm py-1 px-3"
                          onClick={() => handleInterestToggle(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button onClick={handleSave} className="w-full">Save Preferences</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthCheck>
  )
}

