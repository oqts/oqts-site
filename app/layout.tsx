import type { Metadata, Viewport } from 'next';
import '../styles/site.css';
import Masthead from '../components/Masthead';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://oqts.org'),
  title: {
    default: 'Oxford Quantitative Trading Society',
    template: '%s — Oxford Quantitative Trading Society',
  },
  description:
    'The Oxford Quantitative Trading Society teaches quantitative trading by doing — markets education, the OXDAQ trading competition, and a community of Oxford students who build and trade.',
  openGraph: {
    siteName: 'Oxford Quantitative Trading Society',
    images: ['/brand/favicon/og-card.png'],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/brand/favicon/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/brand/favicon/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/brand/favicon/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#002147',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="stylesheet" href="/brand/oqts.css" />
        <link
          rel="preload"
          href="/brand/fonts/latin-modern-mono/LatinModernMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/brand/fonts/stix-two-text/STIXTwoText-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Masthead />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
