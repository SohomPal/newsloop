'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { NewsArticle } from '@/types/NewsArticle'
import { NewsCard } from '@/components/NewsCard'
import { AuthCheck } from '@/components/auth-check'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function SavedArticles() {
  const { data: session } = useSession()
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSavedArticles() {
      if (!session?.user?.email) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/fetchSavedArticles?email=${session.user.email}`)
        if (!response.ok) {
          throw new Error('Failed to fetch saved articles')
        }
        const data = await response.json()
        console.log('Fetched saved articles:', data.articles) // Add this line for debugging
        setSavedArticles(data.articles)
      } catch (err) {
        console.error('Error fetching saved articles:', err)
        setError('Failed to load saved articles. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedArticles()
  }, [session])

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Saved Articles</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : savedArticles && savedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedArticles.map((article, index) => (
              <NewsCard key={index} article={article} session={session} saved={true}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">
            You haven't saved any articles yet.
          </p>
        )}
      </div>
    </AuthCheck>
  )
}

