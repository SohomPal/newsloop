import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Newspaper } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="text-center">
        <div className="mb-8 text-white">
          <Newspaper className="mx-auto h-24 w-24 animate-bounce" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Oops! Page Not Found</h2>
        <p className="text-xl text-white mb-8">
          Looks like this article has been misplaced in our NewsLoop!
        </p>
        <div className="space-y-4">
          <Button asChild className="bg-white text-blue-600 hover:bg-blue-100">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

