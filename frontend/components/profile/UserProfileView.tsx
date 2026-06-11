"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateUserAvatar } from "@/lib/usersApi";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import { Role } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";

type AvatarFormData = {
  avatar: string;
};

export default function UserProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading, setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvatarFormData>({
    values: {
      avatar: user?.avatar ?? "",
    },
  });

  const onSubmit = async (data: AvatarFormData) => {
    const response = await updateUserAvatar(data);
    setAuth(response.data);
    setIsEditing(false);
  };

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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

            {!isEditing && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsEditing(true)}
              >
                Edit profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-(--color-muted)">
                  Avatar URL
                </label>
                <input
                  type="text"
                  {...register("avatar", {
                    required: "Avatar URL is required",
                  })}
                  className="mt-1 h-11 w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-4 outline-none transition focus:border-brand"
                />
                {errors.avatar && (
                  <p className="mt-1 text-sm text-brand">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" size="md" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileField label="Name" value={user.name} />
                <ProfileField label="Email" value={user.email} />
                <ProfileField label="Role" value={user.role} />
                <ProfileField
                  label="Favorites"
                  value={user.favorites?.length ?? 0}
                />
              </div>

              <div className="mt-6">
                <Button variant="ghost" size="lg" onClick={handleNavigation}>
                  View favorites
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
