export interface NewsArticle {
  title: string
  description: string
  url: string
  imageUrl: string
  datePublished: {
    $date: string; // ISO date string
  };
  [key: string]: any; // Optional: To handle any additional fields dynamically
}