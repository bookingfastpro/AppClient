/**
 * Fails loudly, and by name, when a required environment variable is
 * missing.
 *
 * This replaces the `process.env.FOO!` non-null assertions that used to
 * sit at every client constructor. Those passed `undefined` straight into
 * supabase-js, which threw "supabaseKey is required" from deep inside a
 * Server Component render — and React strips that message in production
 * builds (error #441, "the specific message is omitted to avoid leaking
 * sensitive details"). The result was that one unset variable reached the
 * user as an unexplained "This page couldn't load" with nothing
 * actionable anywhere in the console. Throwing here puts the variable's
 * name in the server log instead.
 *
 * The value is passed in rather than looked up from `name` on purpose:
 * Next inlines NEXT_PUBLIC_* variables at build time only where it can
 * see a literal `process.env.NEXT_PUBLIC_FOO` member expression in the
 * source. A dynamic `process.env[name]` lookup defeats that and would
 * leave every public variable undefined in the browser bundle, so the
 * call site keeps the static expression and hands us its result.
 */
export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. ` +
        `En développement, ajoutez-la à .env.local (voir .env.example). ` +
        `En déploiement, les variables NEXT_PUBLIC_* doivent être fournies ` +
        `au moment du build, les autres au runtime.`,
    );
  }
  return value;
}
