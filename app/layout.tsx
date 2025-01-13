import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { getServerSession, Session } from "next-auth";
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
  const session = (await getServerSession(authOptions)) as Session | null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <ClientWrapper session={session}>
              {children}
            </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

