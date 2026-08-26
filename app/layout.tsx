import type { Metadata, Viewport } from "next";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { allLanguageRoutePairs } from "@/lib/languageRoutes";
import { assetPath, googlePlaceId, googlePlacesKey, siteUrl } from "@/lib/seo";
import "./globals.css";

const routePairsJson = JSON.stringify(
  allLanguageRoutePairs().reduce<Record<string, { es: string; en: string }>>((acc, pair) => {
    acc[pair.es] = pair;
    acc[pair.en] = pair;
    return acc;
  }, {})
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fotógrafo en Santo Domingo · Babula Shots · 4.9★ 100 reseñas",
    template: "%s"
  },
  description: "Fotógrafo en Santo Domingo con cobertura en toda República Dominicana: bodas, estudio, drone, inmobiliaria. Reserva 809 720 9547 · 4.9★ 100 reseñas Google.",
  openGraph: {
    siteName: "Babula Shots",
    locale: "es_DO",
    type: "website",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots — Fotógrafo en Santo Domingo y República Dominicana"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Fotógrafo en Santo Domingo · Babula Shots · 4.9★ 100 reseñas",
    description: "Fotógrafo en Santo Domingo con cobertura en toda República Dominicana: bodas, estudio, drone, inmobiliaria. Reserva 809 720 9547 · 4.9★ 100 reseñas Google.",
    images: ["/images/social-card-1200x630.webp"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: assetPath("/wp-content/uploads/2023/05/cropped-cropped-babulashotslogo-1-32x32.png"), sizes: "32x32", type: "image/png" },
      { url: assetPath("/wp-content/uploads/2023/05/cropped-cropped-babulashotslogo-1-180x180.png"), sizes: "180x180", type: "image/png" },
      { url: assetPath("/wp-content/uploads/2023/05/cropped-babulashotslogo-1.png"), sizes: "270x270", type: "image/png" }
    ],
    apple: assetPath("/wp-content/uploads/2023/05/cropped-cropped-babulashotslogo-1-180x180.png")
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: "#f7f4ee"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO" suppressHydrationWarning>
      <head>
        {/* Google Preferred Sources button — renders inside any
           [google-add-preferred-source-btn] element (see ContactSection). */}
        <script async src="https://news.google.com/swg/js/v1/publisher.js" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}"
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(/[?&]sent=ok\\b/.test(location.search))document.documentElement.classList.add('callback-sent')}catch(e){}"
          }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <ContactSection />
        <SiteFooter />
        <WhatsAppFab />
        {/* Babula Shots HITL chat widget (replaces Tawk.to as of 2026-05-24).
           Loads ~9KB bundle from chat.babulashotsrd.com on idle.
           data-bb-site=apex routes prompts to the multi-niche umbrella KB.
           1-line revert: re-enable the Tawk block below + remove this one. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function l(){var s=document.createElement('script');s.async=true;s.src='https://chat.babulashotsrd.com/widget.js';s.dataset.bbSite='apex';document.body.appendChild(s);}if(window.requestIdleCallback){window.requestIdleCallback(l,{timeout:3000})}else{window.addEventListener('load',function(){setTimeout(l,1000)})}})();"
          }}
        />
        {/* Old Tawk widget — commented out 2026-05-24, kept for fast revert.
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function l(){var T=window.Tawk_API||(window.Tawk_API={});window.Tawk_LoadStart=new Date();var s=document.createElement('script');s.async=true;s.src='https://embed.tawk.to/662b0680a0c6737bd1308ff1/1hsc12p8m';s.charset='UTF-8';s.setAttribute('crossorigin','*');document.body.appendChild(s);}if(window.requestIdleCallback){window.requestIdleCallback(l,{timeout:3000})}else{window.addEventListener('load',function(){setTimeout(l,1000)})}})();"
          }}
        />
        */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9d9609d200c5496dba02da82d492914f"}'
        />
        {/* Live Google rating: refreshes the ContactSection badge to the real-time
           Google count on load; falls back to the static count. Referrer-restricted key. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function l(){try{fetch('https://places.googleapis.com/v1/places/" +
              googlePlaceId +
              "?fields=rating,userRatingCount&key=" +
              googlePlacesKey +
              "').then(function(r){return r.json()}).then(function(d){if(!d)return;if(d.rating){document.querySelectorAll('[data-g-rating]').forEach(function(e){e.textContent=String(d.rating)})}if(typeof d.userRatingCount==='number'){document.querySelectorAll('[data-g-count]').forEach(function(e){e.textContent=String(d.userRatingCount)})}}).catch(function(){})}catch(e){}}if(window.requestIdleCallback){requestIdleCallback(l,{timeout:4000})}else{window.addEventListener('load',function(){setTimeout(l,800)})}})();"
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document,r=d.documentElement;function s(t){r.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}}d.addEventListener('click',function(e){var t=e.target,bt=t&&t.closest&&t.closest('[data-theme-toggle]');if(bt){s(r.dataset.theme==='dark'?'light':'dark');return}var dt=t&&t.closest&&t.closest('[data-drawer-toggle]');if(dt){var open=r.classList.toggle('drawer-open');dt.setAttribute('aria-expanded',open?'true':'false');var dr=d.getElementById('site-drawer');if(dr){if(open){dr.removeAttribute('hidden')}else{setTimeout(function(){if(!r.classList.contains('drawer-open'))dr.setAttribute('hidden','')},220)}}return}var dc=t&&t.closest&&t.closest('[data-drawer-close]');if(dc){r.classList.remove('drawer-open');var bt2=d.querySelector('[data-drawer-toggle]');if(bt2)bt2.setAttribute('aria-expanded','false');var dr2=d.getElementById('site-drawer');if(dr2)setTimeout(function(){if(!r.classList.contains('drawer-open'))dr2.setAttribute('hidden','')},220)}});d.addEventListener('keydown',function(e){if(e.key==='Escape'&&r.classList.contains('drawer-open')){r.classList.remove('drawer-open');var bt=d.querySelector('[data-drawer-toggle]');if(bt)bt.setAttribute('aria-expanded','false');var dr=d.getElementById('site-drawer');if(dr)setTimeout(function(){if(!r.classList.contains('drawer-open'))dr.setAttribute('hidden','')},220)}});var p=location.pathname;p=p.endsWith('/')?p:p+'/';var m=" + routePairsJson + ";var pair=m[p];var esLinks=d.querySelectorAll('[data-lang-link=\"es\"]'),enLinks=d.querySelectorAll('[data-lang-link=\"en\"]');if(pair){esLinks.forEach(function(a){if(pair.es){a.setAttribute('href',pair.es);if(p===pair.es)a.setAttribute('aria-current','page')}else{a.style.display='none'}});enLinks.forEach(function(a){if(pair.en){a.setAttribute('href',pair.en);if(p===pair.en)a.setAttribute('aria-current','page')}else{a.style.display='none'}})}else{esLinks.forEach(function(a){a.setAttribute('href',p);a.setAttribute('aria-current','page')});enLinks.forEach(function(a){a.style.display='none'});var seps=d.querySelectorAll('.lang-sep');seps.forEach(function(s){s.style.display='none'})}}catch(e){}"
          }}
        />
      </body>
    </html>
  );
}
