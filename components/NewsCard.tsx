import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { NewsArticle } from '@/types/NewsArticle'
import { useState, useEffect } from 'react'
import { BookmarkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Session } from 'next-auth'

interface NewsCardProps {
  article: NewsArticle
  session: Session | null
  saved?: boolean
}

function timeSincePublished(datePublished: any): string {
  const publishedTime = Date.parse(datePublished)
  const currentTime = Date.now()
  const diffInMilliseconds = currentTime - publishedTime

  if (diffInMilliseconds < 0) {
    return "In the future"
  }

  const diffInMinutes = Math.floor(diffInMilliseconds / 60000)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days !== 1 ? "s" : ""} ago`
  }
}

export function NewsCard({ article, session, saved = false }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isSaved, setIsSaved] = useState(saved)

  useEffect(() => {
    setIsSaved(saved)
  }, [saved])

  const handleArticleClick = async () => {
    window.open(article.url, '_blank', 'noopener,noreferrer')

    const res = await fetch('/api/updateUserTags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          email: session?.user?.email,
          tags: article.topics,
      }),
    });
  }

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the article link from being triggered
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    const res = await fetch('/api/saveArticle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          email: session?.user?.email,
          articleID: article._id,
          saved: newSavedState,
      }),
    });
    if (!res.ok) {
      // If the API call fails, revert the local state
      setIsSaved(!newSavedState)
      console.error('Failed to save/unsave article')
    }
  }

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleArticleClick}
    >
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        {session && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-[-0.5rem] mr-[-0.5rem]"
            onClick={handleSaveClick}
          >
            <BookmarkIcon 
              className={`h-5 w-5 ${isSaved ? 'fill-current text-primary' : ''}`} 
            />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative w-full h-48 mb-4 bg-muted">
          {!imageError && article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-3">{article.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {timeSincePublished(article.datePublished)}
        </p>
      </CardFooter>
    </Card>
  )
}

