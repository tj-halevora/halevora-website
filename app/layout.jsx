import Script from 'next/script';
import './globals.css';
import './redesign.css';

export const metadata = {
  metadataBase: new URL('https://halevora.com'),
  title: {
    default: 'Halevora',
    template: '%s | Halevora',
  },
  description: 'Halevora manages online creators. We handle content, social accounts, brand deals, paid media and distribution.',
  applicationName: 'Halevora',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Halevora',
    locale: 'en_US',
    title: 'Halevora',
    description: 'Halevora manages online creators. We handle content, social accounts, brand deals, paid media and distribution.',
  },
  twitter: {
    card: 'summary',
    title: 'Halevora',
    description: 'Halevora manages online creators. We handle content, social accounts, brand deals, paid media and distribution.',
  },
};

export const viewport = { themeColor: '#232323' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="preload" href="/silk-fallback.jpg" as="image" /></head>
      <body>
        <Script id="halevora-initial-scroll" strategy="beforeInteractive">{`
          (() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if ((location.pathname === '/' || location.pathname === '/bird-journey') &&
                !location.hash && navigation?.type !== 'back_forward') {
              history.scrollRestoration = 'manual';
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
