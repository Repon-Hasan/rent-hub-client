import NextAuthProvider from "@/Providers/NextAuthProvider";
import "./globals.css";

export const metadata = {
  title: "Rent Hub",
  description: "Your go-to rent website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
