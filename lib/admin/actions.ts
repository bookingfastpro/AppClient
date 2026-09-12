"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId, youtubeThumbnailUrl } from "@/lib/video/youtube";
import { videoFormSchema, type VideoFormValues } from "@/lib/validations/video";
import { slugify } from "@/lib/utils";

export type VideoFormState = {
  error: string | null;
};

async function uniqueSlug(admin: ReturnType<typeof createAdminClient>, base: string, excludeId?: string) {
  const root = slugify(base) || "session";
  let candidate = root;
  let suffix = 1;

  for (;;) {
    let query = admin.from("videos").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

type ParsedVideoForm =
  | { ok: false; error: string }
  | { ok: true; data: VideoFormValues; youtubeId: string };

function parseVideoForm(formData: FormData): ParsedVideoForm {
  const parsed = videoFormSchema.safeParse({
    youtubeUrl: formData.get("youtubeUrl"),
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    level: formData.get("level") || undefined,
    instructor: formData.get("instructor"),
    durationMinutes: formData.get("durationMinutes"),
    isPremium: formData.get("isPremium") === "on",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const youtubeId = extractYoutubeId(parsed.data.youtubeUrl);
  if (!youtubeId) {
    return { ok: false, error: "Impossible de trouver un identifiant YouTube valide dans ce lien." };
  }

  return { ok: true, data: parsed.data, youtubeId };
}

export async function createVideoAction(
  _prevState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> {
  await requireAdmin();
  const result = parseVideoForm(formData);
  if (!result.ok) return { error: result.error };

  const admin = createAdminClient();
  const slug = await uniqueSlug(admin, result.data.title);

  const { error } = await admin.from("videos").insert({
    slug,
    title: result.data.title,
    description: result.data.description,
    category_id: result.data.categoryId,
    is_premium: result.data.isPremium,
    youtube_id: result.youtubeId,
    duration_seconds: result.data.durationMinutes * 60,
    level: result.data.level ?? null,
    instructor: result.data.instructor,
    published_at: new Date().toISOString(),
  });

  if (error) {
    return { error: "Une erreur est survenue lors de l'enregistrement de cette vidéo. Veuillez réessayer." };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/home");
  revalidatePath("/explore");
  redirect("/admin/videos");
}

export async function updateVideoAction(
  videoId: string,
  _prevState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> {
  await requireAdmin();
  const result = parseVideoForm(formData);
  if (!result.ok) return { error: result.error };

  const admin = createAdminClient();
  const slug = await uniqueSlug(admin, result.data.title, videoId);

  const { error } = await admin
    .from("videos")
    .update({
      slug,
      title: result.data.title,
      description: result.data.description,
      category_id: result.data.categoryId,
      is_premium: result.data.isPremium,
      youtube_id: result.youtubeId,
      duration_seconds: result.data.durationMinutes * 60,
      level: result.data.level ?? null,
      instructor: result.data.instructor,
    })
    .eq("id", videoId);

  if (error) {
    return { error: "Une erreur est survenue lors de l'enregistrement de cette vidéo. Veuillez réessayer." };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/home");
  revalidatePath("/explore");
  redirect("/admin/videos");
}

export async function deleteVideoAction(formData: FormData) {
  await requireAdmin();
  const videoId = formData.get("videoId");
  if (typeof videoId !== "string" || !videoId) return;

  const admin = createAdminClient();
  await admin.from("videos").delete().eq("id", videoId);

  revalidatePath("/admin/videos");
  revalidatePath("/home");
  revalidatePath("/explore");
}

export async function fetchYoutubeMetadataAction(input: string) {
  await requireAdmin();
  const youtubeId = extractYoutubeId(input);
  if (!youtubeId) return null;

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${youtubeId}`,
      )}&format=json`,
    );
    if (!res.ok) return { youtubeId, title: null, thumbnailUrl: youtubeThumbnailUrl(youtubeId) };
    const data = await res.json();
    return {
      youtubeId,
      title: typeof data.title === "string" ? data.title : null,
      thumbnailUrl: youtubeThumbnailUrl(youtubeId),
    };
  } catch {
    return { youtubeId, title: null, thumbnailUrl: youtubeThumbnailUrl(youtubeId) };
  }
}
