import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /**
   * Development only, and it has no effect on a production build.
   *
   * Next serves the dev server on `localhost` and blocks cross-origin
   * requests to its dev-only assets, `/_next/hmr` included. Reaching the
   * same server by any other host — 127.0.0.1, or the machine's LAN IP
   * when testing on a real phone — trips that block: the HMR socket
   * never connects, the dev client falls back to reloading the page, and
   * it reloads before React finishes hydrating. Every button on the site
   * then does nothing at all, with no error to explain why.
   *
   * Listing the hosts we actually develop from removes the trap. LAN
   * addresses are enumerated by RFC 1918 range because testing the PWA
   * on a phone means hitting this server by IP.
   */
  allowedDevOrigins: [
    "127.0.0.1",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.2*.*.*",
    "172.30.*.*",
    "172.31.*.*",
  ],
  experimental: {
    serverActions: {
      // Programme cover uploads go through a Server Action, and the
      // default cap is 1MB. 6mb leaves headroom above the 5MB the action
      // itself enforces, for multipart boundaries and field metadata.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
