import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/lib/context/user-context'
import Header from '@/components/header'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RouteMapper - Create & Share Tourist Routes',
  description: 'Create beautiful tourist routes with landmarks and share them with others',
}

export const viewport = {
  themeColor: '#1a472a',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className} bg-background text-foreground`}>
        <UserProvider>
          <Header/>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
