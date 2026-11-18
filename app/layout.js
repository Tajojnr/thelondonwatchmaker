// app/layout.js
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

// Display face: refined, high-contrast horological serif
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Body face: geometric, classic dial lettering
const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = 'https://thelondonwatchmaker.vercel.app';
const SITE_NAME = 'The London Watchmaker';
const TITLE = 'The London Watchmaker | Master Watch Repair in Hatton Garden, London';
const DESCRIPTION =
  'Independent master watchmaker Jonathan Santos in Hatton Garden. Live on-the-bench diagnostics, COSC 5-position regulation, 15-minute fixes, and complete overhauls for Rolex, Patek Philippe, Cartier, and Omega.';
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | The London Watchmaker',
  },
  description: DESCRIPTION,
  keywords: [
    'watchmaker London',
    'watch repair Hatton Garden',
    'Rolex service London',
    'Cartier watch repair London',
    'independent horologist London',
    'Jonathan Santos watchmaker',
    'Patek Philippe repair London',
    'Omega watch service London',
    'COSC watch regulation London',
  ],
  authors: [{ name: 'Jonathan Santos', url: SITE_URL }],
  creator: 'Jonathan Santos',
  publisher: 'The London Watchmaker',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'The London Watchmaker — Master Horologist Atelier in Hatton Garden',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE_URL],
    creator: '@londonwatchmaker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#06100C',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Rich LocalBusiness structured data for Google Maps and Local Search
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE_URL,
  description: DESCRIPTION,
  telephone: '+447892883885',
  priceRange: '££–££££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  founder: {
    '@type': 'Person',
    name: 'Jonathan Santos',
    jobTitle: 'Master Horologist & Independent Watchmaker',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 04, Colonial Buildings (Edelsteen), 62 Hatton Garden',
    addressLocality: 'London',
    postalCode: 'EC1N 8LR',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5186,
    longitude: -0.1075,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:30',
      closes: '17:30',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '103',
    bestRating: '5',
    worstRating: '1',
  },
  areaServed: {
    '@type': 'City',
    name: 'London',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Horological Workshop Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Live On-the-Spot Diagnostics',
          description: 'Live case opening, Swiss Witschi timing analysis, and vacuum seal testing.',
        },
        price: '0.00',
        priceCurrency: 'GBP',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Full Calibre Overhaul',
          description: 'Complete movement strip-down, 4-stage ultrasonic wash, synthetic lubrication, and 5-position regulation.',
        },
        price: '250.00',
        priceCurrency: 'GBP',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Fallback direct meta tags for crawlers that bypass dynamic metadata */}
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:secure_url" content={OG_IMAGE_URL} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="The London Watchmaker - Hatton Garden Atelier" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <meta name="twitter:image:alt" content="The London Watchmaker - Hatton Garden Atelier" />
      </head>
      <body className="bg-[#06100C] font-[family-name:var(--font-body)] text-[#F7F4EE] antialiased selection:bg-[#C9A050] selection:text-[#06100C] overflow-x-clip relative">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#C9A050] focus:px-4 focus:py-2 focus:text-[#06100C] focus:font-medium focus:shadow-lg"
        >
          Skip to main workshop content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}