import { ObjectId } from "mongodb";

type User = {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  preferences: string[];
  savedArticles: string[];
  tagHistory: Record<string, number>;
};

type Article = {
  _id: ObjectId;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  url: string;
  category: string;
  topics: string[];
  saved: boolean;
};

export default function rankArticles(user: User, articles: Article[]): Article[] {
  const { preferences, savedArticles, tagHistory } = user;

  return articles
    .map((article) => {
      // Initial score
      let score = 0;

      // Check if article is saved; penalize saved articles
      const isSaved = savedArticles.includes(article._id.toHexString());
      if (isSaved) score -= 500; // Push saved articles to the bottom

      // Add score for category matching preferences
      if (preferences.includes(article.category)) {
        score += 10; // Higher weight for preferences
      }

      // Add score for matching topics with tagHistory
      article.topics.forEach((topic) => {
        if (tagHistory[topic]) {
          score += tagHistory[topic]; // Add weight based on tag frequency in history
        }
      });

      // Add score for recency (more recent = higher score)
      const daysSincePublished = (new Date().getTime() - new Date(article.datePublished).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 10 - daysSincePublished); // Decrease score as the article gets older

      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .map(({ score, ...article }) => article); // Remove score and return articles
}
