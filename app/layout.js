// app/layout.js
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

// Display face: refined, high-contrast, reads as horology rather than "generic luxury serif"
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Body face: geometric, close to classic dial lettering. Matches the OG image.
const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = 'https://thelondonwatchmaker.co.uk';
const SITE_NAME = 'The London Watchmaker';
const DESCRIPTION =
  'Independent master watchmaker in Hatton Garden. Live bench diagnostics, 15-minute fixes and full overhauls for Rolex, Patek Philippe, Cartier and Omega.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The London Watchmaker | Master Watch Repair in Hatton Garden, London',
    template: '%s | The London Watchmaker',
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: SITE_NAME,
    title: 'Master Watch Repair in Hatton Garden, London',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Watch Repair in Hatton Garden, London',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#06100C',
  colorScheme: 'dark',
};

// Structured data for local search
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  telephone: '+447892883885',
  founder: { '@type': 'Person', name: 'Jonathan Santos', jobTitle: 'Master Watchmaker' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 04, Colonial Buildings, 62 Hatton Garden',
    addressLocality: 'London',
    addressCountry: 'GB',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-[#06100C] font-[family-name:var(--font-body)] text-[#F7F4EE] antialiased selection:bg-[#C9A050] selection:text-[#06100C]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#C9A050] focus:px-4 focus:py-2 focus:text-[#06100C]"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <div id="main">{children}</div>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}