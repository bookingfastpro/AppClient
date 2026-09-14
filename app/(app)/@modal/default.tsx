/**
 * The modal slot renders nothing unless an intercepting route fills it.
 * Parallel route slots need an explicit default for hard navigations —
 * without this file, loading /programmes/[slug] directly would fail on
 * the unmatched slot instead of rendering the full page.
 */
export default function Default() {
  return null;
}
