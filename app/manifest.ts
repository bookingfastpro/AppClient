import type { MetadataRoute } from "next";

/**
 * Served at /manifest.webmanifest; Next injects the <link rel="manifest">
 * automatically, so the root layout must not add one of its own.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yogella — Yoga, Méditation & Sommeil",
    short_name: "Yogella",
    description:
      "Un espace calme et premium pour la pratique du yoga, de la méditation, de la respiration et du sommeil.",
    lang: "fr",
    dir: "ltr",
    // Lands signed-in members straight on the app rather than the
    // marketing page. Visitors without a session are redirected to
    // /sign-in by the proxy, which is the behaviour we want anyway.
    start_url: "/home",
    scope: "/",
    display: "standalone",
    // Both match --color-cream: background_color paints the splash screen
    // while the app boots, theme_color tints the system chrome around it.
    // A mismatch here shows as a flash of the wrong colour on launch.
    background_color: "#faf6ef",
    theme_color: "#faf6ef",
    // Deliberately not "portrait". In standalone mode Android enforces
    // this value, which would defeat the video player's rotate-to-
    // landscape control (components/video/CustomVideoPlayer.tsx).
    orientation: "any",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Kept separate from the "any" icons on purpose: a single icon
      // declared as both gets cropped to the platform's mask shape when
      // used as "any", which clips the rounded square's corners.
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
