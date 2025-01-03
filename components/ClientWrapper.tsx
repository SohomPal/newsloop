"use client"; // Marks this as a client component

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ClientWrapperProps {
  children: ReactNode;
  session: Session | null;
}

export default function ClientWrapper({ children, session }: ClientWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
