'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsCard } from '@/components/NewsCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { NewsArticle } from '@/types/NewsArticle'
import { SignUpOverlay } from '@/components/SignUpOverlay'
import { SignUpModal } from '@/components/signup-modal'

import { useSession } from 'next-auth/react'

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const { data: session } = useSession()

  const toggleBodyScroll = useCallback((disable: boolean) => {
    document.body.style.overflow = disable ? 'hidden' : 'unset';
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true)
        const response = await fetch(`api/news?page=${page}`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const newArticles = await response.json()

        // Check if there are more articles to load
        setArticles((prevArticles) => [...prevArticles, ...newArticles])
        if (newArticles.length < 9) {
          setHasMore(false)
        }

        // Show signup prompt after 2 page loads for non-authenticated users
        if (!session && page === 1) {
          setShowSignUpPrompt(true)
          toggleBodyScroll(true);
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [page, session, toggleBodyScroll])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        if (!isLoading && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore])

  console.log({session})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {session ? "Your Personalized News Feed" : "Today's Top Headlines"}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
      {isLoading && <LoadingSpinner />}
      {!hasMore && articles.length > 0 && (
        <p className="mt-6 text-center text-gray-500">
          You've reached the end of the feed.
        </p>
      )}
      {!hasMore && articles.length === 0 && (
        <p className="mt-6 text-center text-gray-500">
          No articles available at this time.
        </p>
      )}
      {showSignUpPrompt && (
        <SignUpOverlay 
          onClose={() => {
            setShowSignUpPrompt(false);
            toggleBodyScroll(false);
          }} 
          onSignUp={() => {
            setShowSignUpPrompt(false);
            setShowSignUpModal(true);
          }}
        />
      )}
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => {
          setShowSignUpModal(false);
          toggleBodyScroll(false);
        }} 
      />
    </div>
  )
}

