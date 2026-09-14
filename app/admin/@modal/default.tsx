/**
 * The modal slot renders nothing unless an intercepting route fills it.
 * Parallel route slots need an explicit default for hard navigations —
 * without this file, loading /admin/programs/[id] directly would 404 on
 * the unmatched slot instead of rendering the full page.
 */
export default function Default() {
  return null;
}
