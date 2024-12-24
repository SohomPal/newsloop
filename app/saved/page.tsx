import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SavedArticles() {
  // This would be replaced with actual saved articles
  const savedArticles = [
    { id: 1, title: 'The Future of Renewable Energy', description: 'New advancements in solar and wind power technologies.' },
    { id: 2, title: 'Artificial Intelligence in Education', description: 'How AI is transforming the learning experience.' },
  ]

  return (
    <div>
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
    </div>
  )
}

