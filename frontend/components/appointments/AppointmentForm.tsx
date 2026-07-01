"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createAppointmentRequest } from "@/lib/appointmentsApi";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import type { Nanny } from "@/types/types";
import { useToast } from "@/components/providers/ToastProvider";

const phoneRegex = /^\+380\d{9}$/;

const normalizePhone = (value: string): string => {
  if (!value.trim()) return "";

  const digits = value.replace(/\D/g, "");
  const nationalNumber = digits.startsWith("380")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  return `+380${nationalNumber.slice(0, 9)}`;
};

const formatPhoneInput = (value: string): string => {
  const normalizedPhone = normalizePhone(value);

  if (!normalizedPhone) return "+380 ";

  const nationalNumber = normalizedPhone.slice(4);
  const phoneParts = [
    nationalNumber.slice(0, 2),
    nationalNumber.slice(2, 5),
    nationalNumber.slice(5, 7),
    nationalNumber.slice(7, 9),
  ].filter(Boolean);

  return ["+380", ...phoneParts].join(" ");
};

const appointmentSchema = z.object({
  parentName: z.string().min(2, "Name is required").trim(),
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
  address: z.string().min(5, "Address must be at least 5 characters").trim(),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .min(1, "Phone number is required")
        .regex(
          phoneRegex,
          "Phone number must start with +380 and contain 9 digits after it (e.g., +380 67 123 45 67)",
        ),
    ),
  childAge: z.string().min(1, "Child age is required").trim(),
  scheduledAt: z.string().min(1, "Meeting time is required"),
  comment: z.string().trim().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

type AppointmentFormProps = {
  nanny: Nanny;
  onSuccess?: () => void;
};

export default function AppointmentForm({
  nanny,
  onSuccess,
}: AppointmentFormProps) {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      parentName: user?.name ?? "",
      email: user?.email ?? "",
      address: "",
      phone: "+380 ",
      childAge: "",
      scheduledAt: "",
      comment: "",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const comment = data.comment?.trim();

      await createAppointmentRequest(nanny.id, {
        ...data,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        comment: comment || undefined,
      });

      showToast({
        variant: "success",
        title: "Appointment requested",
        description: `Your request was sent to ${nanny.name}.`,
      });
      onSuccess?.();
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not create appointment",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const inputClassName =
    "h-[36px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] text-base outline-none transition placeholder:text-(--color-muted) focus:border-brand";

  const textareaClassName =
    "min-h-12 w-full resize-y rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] py-3 text-base whitespace-pre-wrap break-words outline-none transition placeholder:text-(--color-muted) focus:border-brand";

  const allowedAvatarHosts = ["ftp.goit.study", "res.cloudinary.com"];
  const hasAllowedAvatarUrl = (() => {
    try {
      return allowedAvatarHosts.includes(new URL(nanny.avatar_url).hostname);
    } catch {
      return false;
    }
  })();

  const phoneRegistration = register("phone");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3">
        {hasAllowedAvatarUrl ? (
          <Image
            src={nanny.avatar_url}
            alt={nanny.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-lg font-medium text-brand">
            {nanny.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div>
          <p className="text-xs text-(--color-muted)">Your nanny</p>
          <p className="font-medium text-foreground">{nanny.name}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        <div>
          <input
            type="text"
            {...register("address")}
            placeholder="Address"
            className={inputClassName}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-brand">{errors.address.message}</p>
          )}
        </div>

        <div>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+380 67 123 45 67"
            maxLength={17}
            {...phoneRegistration}
            onChange={(event) => {
              const formattedPhone = formatPhoneInput(event.target.value);

              setValue("phone", formattedPhone, {
                shouldDirty: true,
                shouldValidate: Boolean(errors.phone),
              });
            }}
            className={inputClassName}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-brand">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("childAge")}
            placeholder="Child's age"
            className={inputClassName}
          />
          {errors.childAge && (
            <p className="mt-1 text-sm text-brand">{errors.childAge.message}</p>
          )}
        </div>

        <div>
          <input
            type="datetime-local"
            {...register("scheduledAt")}
            className={inputClassName}
          />
          {errors.scheduledAt && (
            <p className="mt-1 text-sm text-brand">
              {errors.scheduledAt.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="Email"
            className={inputClassName}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-brand">{errors.email.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <input
            type="text"
            autoComplete="name"
            {...register("parentName")}
            placeholder="Father's or mother's name"
            className={inputClassName}
          />
          {errors.parentName && (
            <p className="mt-1 text-sm text-brand">
              {errors.parentName.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <textarea
            {...register("comment")}
            className={textareaClassName}
            placeholder="Comment"
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-brand">{errors.comment.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="mt-8 h-12 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
