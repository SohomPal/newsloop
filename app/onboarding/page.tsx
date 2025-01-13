'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const topics = [
  "Technology", "Science", "Politics", "Business", 
  "Health", "Entertainment", "Sports", "Travel"
]

export default function Onboarding() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // useEffect(() => {
  //   if (!(session?.user?.isNewUser)) {
  //     router.push('/')
  //   }
  // }, [session, router])

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleComplete = async () => {
    if (selectedTopics.length === 0) {
      alert("Please select at least one topic")
      return
    }

    try {
      
      await await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          preferences: selectedTopics,
        }),
      });
      
      router.push('/')
    } catch (error) {
      console.error("Error updating user preferences:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const slides = [
    // Welcome Slide
    <div key="welcome" className="text-center">
      <h1 className="text-5xl font-bold mb-6 text-white">Welcome to NewsLoop, {session?.user?.name?.split(" ")[0]}!</h1>
      <p className="text-xl mb-8 text-white">We're excited to have you on board. Let's get you set up with a personalized news experience.</p>
      <Button onClick={() => setStep(1)} size="lg" className="bg-white text-purple-600 hover:bg-purple-100">Get Started</Button>
    </div>,

    // Description Slide
    <div key="description" className="text-center">
      <h2 className="text-4xl font-bold mb-6 text-white">Your Personal News Hub</h2>
      <p className="text-lg mb-8 text-white">
        NewsLoop brings you the latest and most relevant news tailored to your interests. 
        Stay informed, discover new perspectives, and never miss out on what matters to you.
      </p>
      <Button onClick={() => setStep(2)} size="lg" className="bg-white text-purple-600 hover:bg-purple-100">Choose Your Interests</Button>
    </div>,

    // Preferences Slide
    <div key="preferences" className="text-center">
      <h2 className="text-4xl font-bold mb-6 text-white">Select Your Interests</h2>
      <p className="text-lg mb-8 text-white">Choose at least one topic to personalize your news feed:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {topics.map(topic => (
          <Card 
            key={topic}
            className={`p-4 cursor-pointer transition-all ${
              selectedTopics.includes(topic) 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-purple-600 hover:bg-purple-100'
            }`}
            onClick={() => handleTopicToggle(topic)}
          >
            {topic}
          </Card>
        ))}
      </div>
      <Button onClick={handleComplete} size="lg" className="bg-white text-purple-600 hover:bg-purple-100" disabled={selectedTopics.length === 0}>
        Complete Sign Up
      </Button>
    </div>
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <Card className="w-full max-w-4xl p-8 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-lg border-none shadow-xl">
        {slides[step]}
        <Progress value={(step + 1) * 33.33} className="mt-8 bg-white/30" />
      </Card>
    </div>
  )
}

