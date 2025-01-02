import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { NewsArticle } from '@/types/NewsArticle'
import { useState } from 'react'

interface NewsCardProps {
  article: NewsArticle
}

function timeSincePublished(datePublished: any): string {
   
    const publishedTime = Date.parse(datePublished); // Convert ISO string to timestamp
    const currentTime = Date.now(); // Get current UTC timestamp
    const diffInMilliseconds = currentTime - publishedTime;
  
    if (diffInMilliseconds < 0) {
      return "In the future";
    }
  
    // Convert difference to minutes
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  
    // Handle minutes, hours, and days
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }
  

  

export function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={article.url} target="_blank" rel="noopener noreferrer">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
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
    </Link>
  )
}

