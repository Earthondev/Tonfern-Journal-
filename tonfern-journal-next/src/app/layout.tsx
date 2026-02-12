import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* ─── Typography System ──────────────────────
   Display: Cormorant Garamond (elegant serif)
   Body: Loaded via Google Fonts link (Kanit, etc.)
   Handwriting: Sriracha, Kalam, Itim
   ───────────────────────────────────────────── */
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tonfern Journal — สมุดบันทึกดิจิทัล",
  description: "สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง พร้อมฟีเจอร์ที่น่าสนใจมากมาย",
  keywords: ["digital-notebook", "book-app", "journal", "firebase", "responsive", "thai-language", "premium-ui"],
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
    title: "Tonfern Journal — สมุดบันทึกดิจิทัล",
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
    title: "Tonfern Journal — สมุดบันทึกดิจิทัล",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={displayFont.variable}>
      <head>
        {/* Google Fonts — Curated for Journal Aesthetic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sriracha&family=Kanit:wght@300;400;500;600;700&family=Kalam:wght@300;400;700&family=Itim&family=Mitr:wght@300;400;500&family=Prompt:wght@300;400;500;600&family=Sarabun:wght@300;400;500;600&family=IBM+Plex+Sans+Thai:wght@300;400;500;600&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags */}
        <meta name="language" content="th" />
        <meta name="geo.region" content="TH" />
        <meta name="geo.placename" content="Thailand" />
        <meta name="theme-color" content="#3e5c3a" />
      </head>
      <body className="font-['Kanit',sans-serif] text-[#2c3e2d] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
