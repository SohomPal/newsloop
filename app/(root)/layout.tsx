import Navbar from '@/components/navbar'
import { getServerSession, Session } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth].js";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as Session | null;

  return (
    <>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar session={session} />
            <main className="flex-grow container mx-auto px-8 py-8">
                {children}
            </main>
        </div>
    </>
  )
}

