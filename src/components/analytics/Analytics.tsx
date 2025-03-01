'use client'

import Script from 'next/script'

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            cookie_flags: 'SameSite=None;Secure',
            anonymize_ip: true,
            cookie_domain: 'none'
          });
        `}
      </Script>
    </>
  )
} 