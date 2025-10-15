import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoFest - Tech Competitions & Hackathons",
  description: "Join exciting tech competitions, hackathons, and learning sessions. Compete, learn, and innovate with the best tech community.",
  keywords: ["NeoFest", "hackathons", "tech competitions", "events", "workshops", "coding", "innovation", "learning"],
  authors: [{ name: "NeoFest Team" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "NeoFest - Tech Competitions & Hackathons",
    description: "Join exciting tech competitions, hackathons, and learning sessions",
    url: "https://neofest.tech",
    siteName: "NeoFest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoFest - Tech Competitions & Hackathons",
    description: "Join exciting tech competitions, hackathons, and learning sessions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
