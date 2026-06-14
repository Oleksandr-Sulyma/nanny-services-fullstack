import type { UploadAvatarResponse } from "@/types/types";

export async function uploadAvatarFile(
  file: File,
): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/uploads/avatar", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Avatar upload failed: ${res.status}`;

    try {
      const errorText = await res.text();
      const parsedError = JSON.parse(errorText);
      errorMessage = parsedError.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  const response: UploadAvatarResponse = await res.json();
  return response;
}
