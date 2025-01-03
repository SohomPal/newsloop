import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'
import { getServerSession, Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import authOptions from "@/pages/api/auth/[...nextauth].js";
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NewsLoop',
  description: 'Personalized news articles based on your interests',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as Session | null; // Cast to Session or null

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar session={session} />
            <main className="flex-grow container mx-auto px-4 py-8">
              <ClientWrapper session={session}>{children}</ClientWrapper>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

