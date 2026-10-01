import React from 'react';
import '../src/index.css';
import '../src/App.css';
import ClientProviders from '../src/components/ClientProviders';
import ClientLayoutWrapper from '../src/components/ClientLayoutWrapper';

export const metadata = {
  title: 'QAMRAH – Premium Nuts & Dates | Nature’s Finest Selection',
  description: "Discover QAMRAH's artisanal collection of handpicked W-180 Jumbo Cashews, California Almonds, Saudi Ajwa Dates, Iranian Pistachios, and Luxury Mix Nuts.",
  keywords: ['Qamrah', 'premium nuts', 'luxury dry fruits', 'ajwa dates', 'w180 cashews', 'roasted pistachios', 'jumbo almonds'],
  icons: {
    icon: '/favicon.svg',
    apple: '/images/logo.png'
  },
  themeColor: '#07130D',
  openGraph: {
    siteName: 'QAMRAH',
    title: 'QAMRAH – Premium Nuts & Dates | Nature’s Finest Selection',
    description: "Discover QAMRAH's artisanal collection of handpicked W-180 Jumbo Cashews, California Almonds, Saudi Ajwa Dates, Iranian Pistachios, and Luxury Mix Nuts.",
    images: ['/images/hero_luxury_bg.jpg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>
          <React.Suspense fallback={null}>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </React.Suspense>
        </ClientProviders>
      </body>
    </html>
  );
}
