'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthCheck } from '@/components/auth-check'

export default function Preferences() {
  const { data: session } = useSession()
  const [interests, setInterests] = useState([
    'Technology',
    'Science',
    'Politics',
    'Sports',
    'Entertainment',
    'Business',
    'Health',
    'Education',
    'Travel',
    'Food',
  ])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

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
            alert(data.message);
        } else {
            alert(data.error);
        }
      } catch (error) {
          console.error("Error updating preferences:", error);
          alert("Failed to update preferences");
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

