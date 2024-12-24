'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function Preferences() {
  const [interests, setInterests] = useState({
    technology: false,
    science: false,
    politics: false,
    sports: false,
    entertainment: false,
  })

  const handleInterestChange = (interest: keyof typeof interests) => {
    setInterests((prev) => ({ ...prev, [interest]: !prev[interest] }))
  }

  const handleSave = () => {
    // Save preferences logic here
    console.log('Saved preferences:', interests)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Preferences</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Interests</h2>
        {Object.entries(interests).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={value}
              onCheckedChange={() => handleInterestChange(key as keyof typeof interests)}
            />
            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
          </div>
        ))}
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}

