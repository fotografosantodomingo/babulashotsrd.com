"use client";

/**
 * Tawk.to live-chat widget.
 *
 * Loaded with strategy="lazyOnload" so Next.js holds the script until the
 * browser is idle (after onLoad fires + main thread free). This keeps the
 * widget from blocking LCP / interaction on first paint while still loading
 * automatically without user action.
 *
 * Property + widget IDs are shared across the entire Babula Shots network
 * (apex + 4 subdomains + fotografosantodomingo.com) so all conversations
 * funnel to a single Tawk dashboard. Override via env vars when needed:
 *   NEXT_PUBLIC_TAWK_PROPERTY_ID
 *   NEXT_PUBLIC_TAWK_WIDGET_ID
 */

import Script from "next/script";

const DEFAULT_PROPERTY_ID = "662b0680a0c6737bd1308ff1";
const DEFAULT_WIDGET_ID = "1hsc12p8m";

export function TawkChat() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || DEFAULT_WIDGET_ID;

  if (!propertyId || !widgetId) return null;

  return (
    <>
      <Script
        id="tawkto-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();"
        }}
      />
      <Script
        id="tawkto-widget"
        strategy="lazyOnload"
        src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
