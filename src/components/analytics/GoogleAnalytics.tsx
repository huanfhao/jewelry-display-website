'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true,
              cookie_domain: 'none'
            });
          `
        }}
      />
    </>
  )
} 