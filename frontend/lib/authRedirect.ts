import { Role, type User } from "@/types/types";
import { getMyNannyProfile } from "@/lib/nanniesApi";

export async function getAuthRedirectPath(user: User): Promise<string | null> {
  if (user.role === Role.PARENT) {
    return null;
  }

  if (user.role === Role.NANNY) {
    const response = await getMyNannyProfile();

    return response.data.isProfileComplete
      ? "/appointments/incoming"
      : "/nanny/profile";
  }

  return null;
}