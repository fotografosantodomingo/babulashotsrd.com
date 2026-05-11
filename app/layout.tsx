import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { allLanguageRoutePairs } from "@/lib/languageRoutes";
import { assetPath, siteUrl } from "@/lib/seo";
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
    default: "Estudio fotografico Sesion de Fotos en Santo Domingo | Babula Shots",
    template: "%s"
  },
  description: "Estudio fotografico Sesion de Fotos en Santo Domingo. Retratos, comida, exteriores y empresas. Reserva tu sesion +1 809 720 9547",
  openGraph: {
    siteName: "Babula Shots - Fotografo Estudio Santo Domingo",
    locale: "es_DO",
    type: "website",
    images: [
      {
        url: "/wp-content/uploads/2024/06/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots Estudio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Estudio fotografico Sesion de Fotos en Santo Domingo | Babula Shots",
    description: "Estudio fotografico Sesion de Fotos en Santo Domingo. Retratos, comida, exteriores y empresas. Reserva tu sesion +1 809 720 9547",
    images: ["/wp-content/uploads/2024/06/social-card-1200x630.webp"]
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
      { url: assetPath("/wp-content/uploads/2024/06/Babula-Shots-Logo-150x150.webp"), sizes: "32x32", type: "image/webp" },
      { url: assetPath("/wp-content/uploads/2024/06/Babula-Shots-Logo.webp"), sizes: "192x192", type: "image/webp" }
    ],
    apple: assetPath("/wp-content/uploads/2024/06/Babula-Shots-Logo.webp")
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}"
          }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFab />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function l(){var T=window.Tawk_API||(window.Tawk_API={});window.Tawk_LoadStart=new Date();var s=document.createElement('script');s.async=true;s.src='https://embed.tawk.to/662b0680a0c6737bd1308ff1/1hsc12p8m';s.charset='UTF-8';s.setAttribute('crossorigin','*');document.body.appendChild(s);}if(window.requestIdleCallback){window.requestIdleCallback(l,{timeout:3000})}else{window.addEventListener('load',function(){setTimeout(l,1000)})}})();"
          }}
        />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9d9609d200c5496dba02da82d492914f"}'
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document,r=d.documentElement;function s(t){r.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}}d.addEventListener('click',function(e){var t=e.target,bt=t&&t.closest&&t.closest('[data-theme-toggle]');if(bt){s(r.dataset.theme==='dark'?'light':'dark');return}var dt=t&&t.closest&&t.closest('[data-drawer-toggle]');if(dt){var open=r.classList.toggle('drawer-open');dt.setAttribute('aria-expanded',open?'true':'false');var dr=d.getElementById('site-drawer');if(dr){if(open){dr.removeAttribute('hidden')}else{setTimeout(function(){if(!r.classList.contains('drawer-open'))dr.setAttribute('hidden','')},220)}}return}var dc=t&&t.closest&&t.closest('[data-drawer-close]');if(dc){r.classList.remove('drawer-open');var bt2=d.querySelector('[data-drawer-toggle]');if(bt2)bt2.setAttribute('aria-expanded','false');var dr2=d.getElementById('site-drawer');if(dr2)setTimeout(function(){if(!r.classList.contains('drawer-open'))dr2.setAttribute('hidden','')},220)}});d.addEventListener('keydown',function(e){if(e.key==='Escape'&&r.classList.contains('drawer-open')){r.classList.remove('drawer-open');var bt=d.querySelector('[data-drawer-toggle]');if(bt)bt.setAttribute('aria-expanded','false');var dr=d.getElementById('site-drawer');if(dr)setTimeout(function(){if(!r.classList.contains('drawer-open'))dr.setAttribute('hidden','')},220)}});var p=location.pathname;p=p.endsWith('/')?p:p+'/';var m=" + routePairsJson + ";var pair=m[p];if(pair){d.querySelectorAll('[data-lang-link=\"es\"]').forEach(function(a){a.setAttribute('href',pair.es)});d.querySelectorAll('[data-lang-link=\"en\"]').forEach(function(a){a.setAttribute('href',pair.en)});var es=p===pair.es,en=p===pair.en;d.querySelectorAll('[data-lang-link=\"es\"]').forEach(function(a){if(es)a.setAttribute('aria-current','page')});d.querySelectorAll('[data-lang-link=\"en\"]').forEach(function(a){if(en)a.setAttribute('aria-current','page')})}}catch(e){}"
          }}
        />
      </body>
    </html>
  );
}
