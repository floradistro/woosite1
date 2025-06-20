import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ClientLayout from "./ClientLayout";

const sfPro = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Pro-Display-Ultralight.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-sf-pro',
});

const donGraffiti = localFont({
  src: '../../public/DonGraffiti.otf',
  display: 'swap',
  preload: true,
  variable: '--font-don-graffiti',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://floradistro.com'),
  title: "Flora Distro - Premium Cannabis Delivery | Same-Day Shipping",
  description: "Premium THCA flower, vapes & edibles. Farm-direct cannabis with same-day shipping. No 30% tax. Real gas, to your door. Legal nationwide shipping.",
  keywords: "cannabis delivery, THCA flower, legal cannabis, same day weed delivery, cannabis dispensary, premium flower, farm direct cannabis",
  authors: [{ name: "Flora Distro" }],
  creator: "Flora Distro",
  publisher: "Flora Distro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: "Flora Distro - Premium Cannabis Delivery",
    description: "Premium farm-direct cannabis. No middlemen, just fire. Same-day shipping available.",
    url: "https://floradistro.com",
    siteName: "Flora Distro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flora Distro - Premium Cannabis Delivery",
    description: "Real gas, to your door. Same-day shipping available.",
    creator: "@floradistro",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#4a4a4a' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sfPro.variable} ${donGraffiti.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for analytics and external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/SF-Pro-Display-Light.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/SF-Pro-Display-Regular.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/DonGraffiti.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="font-sf-pro antialiased relative" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
