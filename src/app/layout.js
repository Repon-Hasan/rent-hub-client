import { Providers } from "@/components/theme-provider"
import "./globals.css"
import ThemeSwitch from "@/components/ThemeSwitch"
import Navbar from "@/components/Navbar"
import Banner from "@/components/ui/Banner"


export const metadata = {
  title: "Rentify",
  description: "Explore thousands of products for rent",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar></Navbar>
            <Banner></Banner>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
