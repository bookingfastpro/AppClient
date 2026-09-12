# No `# syntax=` directive on purpose: it makes BuildKit pull the
# dockerfile frontend image from Docker Hub before the first instruction
# runs, which hangs silently on a host that is rate-limited or has
# restricted registry access. Nothing here needs BuildKit-only syntax.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js inlines NEXT_PUBLIC_* variables at build time, so they must be
# supplied as build args, not just runtime env vars.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Four details here are load-bearing:
#
#  * 127.0.0.1, not localhost. Under musl the hosts file maps localhost to
#    ::1 as well as 127.0.0.1, while the Next standalone server binds
#    0.0.0.0 (IPv4 only). Resolving to the v6 address first turns a
#    perfectly healthy server into a refused connection.
#  * PORT is read, not hard-coded. Coolify injects PORT at runtime; if it
#    ever differs from the ENV default the server moves and a literal
#    3000 probe fails forever.
#  * the error is printed. Docker captures the probe's output into
#    State.Health.Log, so a failure says *why* instead of leaving an
#    empty string to guess at.
#  * exec form, not shell form. The probe would otherwise run through
#    `sh -c`, where a template literal's backticks are command
#    substitution and ${...} is a bad expansion. The JSON array sidesteps
#    both, and every JS string inside uses single quotes so nothing needs
#    escaping.
#
# start-period only stops early failures from counting against retries; a
# successful check still marks the container healthy immediately, so a
# generous window costs nothing.
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD ["node","-e","const u='http://127.0.0.1:'+(process.env.PORT||3000)+'/api/healthz';fetch(u).then(r=>{if(!r.ok)console.error(u+' -> HTTP '+r.status);process.exit(r.ok?0:1)}).catch(e=>{console.error(u+' -> '+e.message);process.exit(1)})"]

# HOSTNAME is set at launch rather than relied on from ENV above, because
# Docker injects its own HOSTNAME (the container name) into the
# environment, and Coolify's generated compose names every container. The
# Next standalone server binds to whatever HOSTNAME says, so that
# injection can make it listen on the container IP only: external traffic
# through the proxy works, while 127.0.0.1 refuses the connection and the
# healthcheck never passes. `exec` keeps node as PID 1 so it still
# receives SIGTERM for a clean shutdown.
CMD ["sh", "-c", "exec env HOSTNAME=0.0.0.0 node server.js"]
