import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  // This would be replaced with actual fetched news articles
  const articles = [
    { id: 1, title: 'AI Breakthrough in Medical Research', description: 'Scientists use AI to discover new drug compounds.' },
    { id: 2, title: 'SpaceX Launches New Satellite Constellation', description: 'Elon Musk\'s company expands global internet coverage.' },
    { id: 3, title: 'Climate Change: New Study Reveals Alarming Trends', description: 'Research shows accelerated ice melt in polar regions.' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Personalized News Feed</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
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
    </div>
  )
}

