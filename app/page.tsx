'use client'

import { useState, useEffect } from 'react'
import { NewsCard } from '@/components/NewsCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { NewsArticle } from '@/types/NewsArticle'

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()

        setArticles(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Personalized News Feed</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  )
}

