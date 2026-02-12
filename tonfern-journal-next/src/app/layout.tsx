import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tonfern Journal - สมุดบันทึกดิจิทัล",
  description: "สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง พร้อมฟีเจอร์ที่น่าสนใจมากมาย",
  keywords: ["digital-notebook", "book-app", "green-theme", "firebase", "responsive", "thai-language", "premium-ui"],
  authors: [{ name: "Fern" }],
  creator: "Fern",
  publisher: "Tonfern Journal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tonfern-journal.vercel.app'),
  openGraph: {
    title: "Tonfern Journal - สมุดบันทึกดิจิทัล",
    description: "สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง",
    url: "https://tonfern-journal.vercel.app",
    siteName: "Tonfern Journal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tonfern Journal",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonfern Journal - สมุดบันทึกดิจิทัล",
    description: "สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sriracha&family=Kanit:wght@300;400;500;600;700&family=Kalam:wght@300;400;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags for Thai language */}
        <meta name="language" content="th" />
        <meta name="geo.region" content="TH" />
        <meta name="geo.placename" content="Thailand" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
