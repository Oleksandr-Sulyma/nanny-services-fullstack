"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerRequest } from "@/lib/authApi";
import { Role } from "@/types/types";
import Button from "@/components/ui/Button";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").trim(),
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^[\x21-\x7E]+$/,
      "Password must contain only Latin letters, numbers, and symbols without spaces",
    )
    .trim(),
  role: z.enum(Role, { message: "Please choose your role" }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: undefined,
    },
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = async (data: UserFormData) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await registerRequest(data);
      setSuccessMessage("Registration successful. Please log in.");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Registration failed");
      }
    }
  };

  const inputClassName =
    "h-[36px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] text-base outline-none transition focus:border-brand";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[18px]"
    >
      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className={inputClassName}
        />
        {errors.name && (
          <p className="text-brand text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

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
          className="absolute right-[18px] top-1/2 -translate-y-1/2"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <EyeOff className="h-5 w-5 text-[var(--color-muted)]" />
          ) : (
            <Eye className="h-5 w-5 text-[var(--color-muted)]" />
          )}
        </button>
        {errors.password && (
          <p className="text-brand text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="relative">
        <select className={`${inputClassName} appearance-none pr-12`} {...register("role")}>
          <option value="" disabled>
            Choose your role
          </option>
          <option value={Role.PARENT}>Parent</option>
          <option value={Role.NANNY}>Nanny</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-[18px] top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted)]" />
      </div>

      <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>

      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      {errorMessage && <p className="text-sm text-brand">{errorMessage}</p>}
    </form>
  );
}
