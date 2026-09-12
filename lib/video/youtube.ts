const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const URL_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
];

/** Extracts an 11-char YouTube video ID from a URL, or a bare ID. Returns null if not found. */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  for (const pattern of URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * mqdefault is native 16:9 (320x180) and guaranteed to exist for every
 * video. hqdefault/sddefault are 4:3 (480x360 / 640x480) — YouTube
 * letterboxes them with black bars for any 16:9 source, which is wrong
 * for every aspect-video container in this app. maxresdefault is true
 * 16:9 at higher resolution but doesn't exist for all videos (fails
 * silently to a tiny gray placeholder), so it's not safe as the default.
 */
export function youtubeThumbnailUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
}

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
