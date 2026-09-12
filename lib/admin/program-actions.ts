"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { programFormSchema } from "@/lib/validations/program";
import { slugify } from "@/lib/utils";

export type ProgramFormState = { error: string | null };

/**
 * PostgREST answers PGRST205 when the table is absent from its schema
 * cache, which in practice means the migration has not been run. Telling
 * the admin to "try again" in that case is misleading: retrying can never
 * succeed, so the missing-migration case gets its own message.
 */
function describeWriteError(error: { code?: string } | null, fallback: string) {
  if (error?.code === "PGRST205") {
    return "La table des programmes n'existe pas encore en base. Appliquez la migration 0017_programs.sql, puis réessayez.";
  }
  return fallback;
}

async function uniqueSlug(
  admin: ReturnType<typeof createAdminClient>,
  base: string,
  excludeId?: string,
) {
  const root = slugify(base) || "programme";
  let candidate = root;
  let suffix = 1;

  for (;;) {
    let query = admin.from("programs").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

function parse(formData: FormData) {
  return programFormSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    level: formData.get("level"),
    published: formData.get("published") === "on",
  });
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type UploadResult = { ok: true; url: string | null } | { ok: false; error: string };

/**
 * Uploads the cover to the public `media` bucket and returns its public
 * URL. Returns `url: null` when no file was submitted, which the callers
 * read as "leave the existing cover alone".
 *
 * The file is re-validated here rather than trusting the input's accept
 * attribute: a Server Action is a public POST endpoint, so the browser's
 * file picker is not a security boundary.
 */
async function uploadCover(
  admin: ReturnType<typeof createAdminClient>,
  formData: FormData,
  slug: string,
): Promise<UploadResult> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: true, url: null };

  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Le fichier doit être une image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "L'image ne doit pas dépasser 5 Mo." };
  }

  const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  // Timestamped so replacing a cover never serves a stale cached file.
  const path = `programmes/${slug}-${Date.now()}.${extension}`;

  const { error } = await admin.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) {
    console.error("uploadCover failed", error);
    return { ok: false, error: "L'envoi de l'image a échoué. Veuillez réessayer." };
  }

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function createProgramAction(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  await requireAdmin();

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const admin = createAdminClient();
  const slug = await uniqueSlug(admin, parsed.data.title);

  const cover = await uploadCover(admin, formData, slug);
  if (!cover.ok) return { error: cover.error };

  const { data, error } = await admin
    .from("programs")
    .insert({
      slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      image_path: cover.url,
      level: parsed.data.level || null,
      published: parsed.data.published,
    })
    .select("id")
    .single();

  if (error || !data) {
    // The viewer gets a generic message, but the cause has to reach the
    // server log or a failure here is undiagnosable.
    console.error("createProgramAction failed", error);
    return {
      error: describeWriteError(
        error,
        "Une erreur est survenue lors de la création. Veuillez réessayer.",
      ),
    };
  }

  revalidatePath("/admin/programs");
  redirect(`/admin/programs/${data.id}`);
}

export async function updateProgramAction(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Programme introuvable." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Saisie invalide" };
  }

  const admin = createAdminClient();
  const slug = await uniqueSlug(admin, parsed.data.title, id);

  const cover = await uploadCover(admin, formData, slug);
  if (!cover.ok) return { error: cover.error };

  const { error } = await admin
    .from("programs")
    .update({
      slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      // Omitted when no new file was sent, so saving the other fields
      // never wipes an existing cover.
      ...(cover.url ? { image_path: cover.url } : {}),
      level: parsed.data.level || null,
      published: parsed.data.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("updateProgramAction failed", error);
    return {
      error: describeWriteError(
        error,
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
      ),
    };
  }

  revalidatePath("/admin/programs");
  revalidatePath(`/admin/programs/${id}`);
  return { error: null };
}

export async function deleteProgramAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const admin = createAdminClient();
  await admin.from("programs").delete().eq("id", id);

  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function addProgramVideoAction(formData: FormData) {
  await requireAdmin();
  const programId = formData.get("programId");
  const videoId = formData.get("videoId");
  if (typeof programId !== "string" || typeof videoId !== "string" || !programId || !videoId) {
    return;
  }

  const admin = createAdminClient();
  // Append: one past the current highest position in this programme.
  const { data: last } = await admin
    .from("program_videos")
    .select("position")
    .eq("program_id", programId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await admin
    .from("program_videos")
    .insert({ program_id: programId, video_id: videoId, position: (last?.position ?? 0) + 1 });

  revalidatePath(`/admin/programs/${programId}`);
}

export async function removeProgramVideoAction(formData: FormData) {
  await requireAdmin();
  const programId = formData.get("programId");
  const videoId = formData.get("videoId");
  if (typeof programId !== "string" || typeof videoId !== "string") return;

  const admin = createAdminClient();
  await admin
    .from("program_videos")
    .delete()
    .eq("program_id", programId)
    .eq("video_id", videoId);

  revalidatePath(`/admin/programs/${programId}`);
}

/**
 * Swaps this row's position with its neighbour in the given direction.
 * Positions are not unique per programme precisely so this two-step swap
 * never trips a constraint midway.
 */
export async function moveProgramVideoAction(formData: FormData) {
  await requireAdmin();
  const programId = formData.get("programId");
  const videoId = formData.get("videoId");
  const direction = formData.get("direction");
  if (
    typeof programId !== "string" ||
    typeof videoId !== "string" ||
    (direction !== "up" && direction !== "down")
  ) {
    return;
  }

  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("program_videos")
    .select("video_id, position")
    .eq("program_id", programId)
    .order("position", { ascending: true });

  if (!rows) return;
  const index = rows.findIndex((r) => r.video_id === videoId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= rows.length) return;

  const current = rows[index];
  const target = rows[targetIndex];

  await admin
    .from("program_videos")
    .update({ position: target.position })
    .eq("program_id", programId)
    .eq("video_id", current.video_id);
  await admin
    .from("program_videos")
    .update({ position: current.position })
    .eq("program_id", programId)
    .eq("video_id", target.video_id);

  revalidatePath(`/admin/programs/${programId}`);
}
