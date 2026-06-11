"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import { Role } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";

export default function UserProfileView() {
  const { user, isLoading } = useAuthStore();

  const router = useRouter();

  const handleNavigation = () => {
    router.push("/favorites");
  };

  if (user && user.role !== Role.PARENT) {
    return <p>This page is available only for parents.</p>;
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!user && <p>Please log in to view your profile</p>}
      {user && (
        <section className="rounded-3xl bg-surface p-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-20 w-20 rounded-2xl object-cover"
                width={80}
                height={80}
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-soft text-2xl font-medium text-brand">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            <div>
              <p className="text-sm text-(--color-muted)">User profile</p>
              <h2 className="mt-2 text-2xl font-medium">{user.name}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField label="Name" value={user.name} />
            <ProfileField label="Email" value={user.email} />
            <ProfileField label="Role" value={user.role} />
            <ProfileField
              label="favorites"
              value={user.favorites?.length ?? 0}
            />
          </div>
          <Button variant="ghost" size="lg" onClick={handleNavigation}>
            View favorites
          </Button>
        </section>
      )}
    </div>
  );
}
