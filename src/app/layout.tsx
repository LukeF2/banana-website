import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ClientBody from "./ClientBody"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-handwriting" })

export const metadata: Metadata = {
  title: "Banana Chen Blog",
  description: "A personal blog by Banana Chen",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}>
      <body className="font-sans min-h-screen bg-background">
        <ClientBody>
          {children}
          <Toaster />
        </ClientBody>
      </body>
    </html>
  )
}
