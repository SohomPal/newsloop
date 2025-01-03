'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthCheck } from '@/components/auth-check'
import { useSession } from 'next-auth/react'
import { NewsArticle } from '@/types/NewsArticle'

export default function SavedArticles() {
  const { data: session } = useSession()
  // This would be replaced with actual saved articles from your database
  const savedArticles = [
    { id: 1, title: 'The Future of Renewable Energy', description: 'New advancements in solar and wind power technologies.' },
    { id: 2, title: 'Artificial Intelligence in Education', description: 'How AI is transforming the learning experience.' },
  ]

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Saved Articles</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {savedArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{article.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        {savedArticles.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            You haven't saved any articles yet.
          </p>
        )}
      </div>
    </AuthCheck>
  )
}

