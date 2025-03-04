'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  if (process.env.NEXT_PUBLIC_GA_ID) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
          nonce="ga-script"
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
          nonce="ga-script"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `}
        </Script>
      </>
    )
  }
  return null
} 