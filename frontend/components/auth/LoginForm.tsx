"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { loginRequest } from "@/lib/authApi";
import { getFavoriteIds } from "@/lib/favorites";
import Button from "@/components/ui/Button";
import { getAuthRedirectPath } from "@/lib/authRedirect";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";

type LoginFormProps = {
  onSuccess?: () => void;
};

const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").trim(),
});

type UserFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { setAuth } = useAuthStore();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { showToast } = useToast();

  const router = useRouter();

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await loginRequest(data);
      setAuth(response.data.user);
      useFavoritesStore
        .getState()
        .setFavorites(getFavoriteIds(response.data.user.favorites));
      const redirectPath = await getAuthRedirectPath(response.data.user);
      onSuccess?.();

      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (error) {
      showToast({
        variant: "error",
        title: "Log in failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const inputClassName =
    "h-[36px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] text-base outline-none transition focus:border-brand";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5">
      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="email"
          className={inputClassName}
        />
        {errors.email && (
          <p className="text-brand text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          {...register("password")}
          placeholder="password"
          className={`${inputClassName} pr-12`}
        />
        <button
          type="button"
          className="absolute right-4.5 top-1/2 -translate-y-1/2"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        >
          {isPasswordVisible ? (
            <EyeOff className="h-5 w-5 text-(--color-muted)" />
          ) : (
            <Eye className="h-5 w-5 text-(--color-muted)" />
          )}
        </button>
        {errors.password && (
          <p className="text-brand text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
