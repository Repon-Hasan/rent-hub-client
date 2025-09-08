import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './globals.css';
import NextAuthProvider from "@/Providers/NextAuthProvider";
import SessionProviderWrapper from "@/Providers/SessionProvider";

export const metadata = {
  title: "RentHub",
  description: "Rental platform for all kinds of assets",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProviderWrapper>
            <Navbar />
            <NextAuthProvider>{children}</NextAuthProvider>
            <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}