import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Yogella — Yoga, Méditation & Sommeil",
    template: "%s — Yogella",
  },
  description:
    "Un espace calme et premium pour la pratique du yoga, de la méditation, de la respiration et du sommeil. Séances gratuites et réservées aux membres, où que vous soyez.",
  // iOS ignores the web app manifest's display mode. Without this, an
  // icon added to the home screen reopens Safari with its chrome instead
  // of launching standalone. The title is what appears under that icon,
  // and is kept short so it isn't truncated.
  appleWebApp: {
    capable: true,
    title: "Yogella",
    // "default" keeps dark status-bar text, which is what the cream
    // header needs; "black-translucent" would push content under the
    // status bar and collide with the header's own pt-safe padding.
    statusBarStyle: "default",
  },
  other: {
    // Next 16 emits only the modern `mobile-web-app-capable` for the
    // `appleWebApp.capable` flag above. Safari honours the manifest's
    // display mode from iOS 15.4 onward, but older iPhones read nothing
    // except this deprecated tag, and without it they reopen the home
    // screen icon inside Safari's chrome. Cheap insurance, and harmless
    // where it is ignored.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Required for the pt-safe/pb-safe padding on the header and bottom
  // nav to receive real env(safe-area-inset-*) values — and doubly so in
  // standalone mode, where there is no browser chrome above the header.
  viewportFit: "cover",
  // Matches --color-cream and the manifest's theme_color. It was white,
  // which showed as a pale band above the header on Android.
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink-900">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
