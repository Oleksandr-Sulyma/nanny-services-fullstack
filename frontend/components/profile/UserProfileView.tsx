"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { updateUserProfile } from "@/lib/usersApi";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import ProfileField from "@/components/ui/ProfileField";
import { uploadAvatarFile } from "@/lib/uploadsApi";
import { Role } from "@/types/types";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/providers/ToastProvider";

type UserProfileFormData = {
  name: string;
  email: string;
};

export default function UserProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, isLoading, setAuth } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      if (!user) return;

      let avatar = user.avatar;

      if (selectedFile) {
        const uploadResponse = await uploadAvatarFile(selectedFile);
        avatar = uploadResponse.data.url;
      }

      const response = await updateUserProfile({
        name: data.name,
        email: data.email,
        avatar,
      });

      setAuth(response.data);
      setIsEditing(false);
      setSelectedFile(null);
      showToast({
        variant: "success",
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast({
        variant: "error",
        title: "Could not update profile",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleNavigation = () => {
    router.push("/favorites");
  };

  const inputClassName =
    "h-[44px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-4 text-base outline-none transition focus:border-brand";
  const displayedAvatar = previewUrl || user?.avatar || "";

  return (
    <div>
      {isLoading && <Spinner />}
      {!user && <p>Please log in to view your profile</p>}

      {user && (
        <section className="rounded-3xl bg-surface p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              {displayedAvatar ? (
                <Image
                  src={displayedAvatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                  width={80}
                  height={80}
                  unoptimized={displayedAvatar.startsWith("blob:")}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                {displayedAvatar ? (
                  <Image
                    src={displayedAvatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                    width={96}
                    height={96}
                    unoptimized={displayedAvatar.startsWith("blob:")}
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-soft text-3xl font-medium text-brand">
                    {user.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="text-sm text-(--color-muted)">Profile photo</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-fit max-w-full"
                  >
                    {selectedFile ? "Change photo" : "Change photo"}
                  </Button>
                  {selectedFile && (
                    <p className="wrap-break-word text-xs text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-(--color-muted)">Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={inputClassName}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-brand">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-(--color-muted)">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className={inputClassName}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-brand">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" size="md" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
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

              {user.role === Role.PARENT && (
                <div className="mt-6">
                  <Button variant="ghost" size="lg" onClick={handleNavigation}>
                    View favorites
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
