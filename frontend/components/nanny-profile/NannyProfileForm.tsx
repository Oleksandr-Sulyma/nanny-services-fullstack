"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type {
  Nanny,
  UpdateNannyProfilePayload,
} from "@/types/types";
import Button from "@/components/ui/Button";
import { updateMyNannyProfile } from "@/lib/nanniesApi";

type NannyProfileFormProps = {
  nanny: Nanny;
  onCancel: () => void;
  onSaved: (nanny: Nanny) => void;
};

const getAllowedBirthDate = (yearsAgo: number): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  return date;
};

const nannyProfileSchema = z.object({
  avatar_url: z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Avatar must be a valid URL",
    }),

  birthday: z
    .string()
    .trim()
    .refine((value) => value !== "", {
      message: "Birthday is required",
    })
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, "Birthday must be a valid date")
    .refine((value) => new Date(value) >= getAllowedBirthDate(70), {
      message: "Maximum allowed age is 70 years",
    })
    .refine((value) => new Date(value) <= getAllowedBirthDate(16), {
      message: "Minimum allowed age is 16 years",
    }),

  experience: z.string().trim().min(1, "Experience is required"),
  education: z.string().trim().min(1, "Education is required"),
  kids_age: z.string().trim().min(1, "Kids age is required"),
  price_per_hour: z
    .number()
    .positive("Price must be a positive number"),
  country: z.string().trim().min(1, "Country is required"),
  region: z.string().trim().min(1, "Region is required"),
  settlement: z.string().trim().min(1, "Settlement is required"),
  about: z.string().trim().min(1, "About is required"),
  characters: z.string().trim().min(1, "Characters are required"),
});

type NannyProfileFormData = z.infer<typeof nannyProfileSchema>;

export default function NannyProfileForm({
  nanny,
  onCancel,
  onSaved,
}: NannyProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NannyProfileFormData>({
    resolver: zodResolver(nannyProfileSchema),
    defaultValues: {
      avatar_url: nanny.avatar_url ?? "",
      birthday: nanny.birthday ? nanny.birthday.slice(0, 10) : "",
      experience: nanny.experience ?? "",
      education: nanny.education ?? "",
      kids_age: nanny.kids_age ?? "",
      price_per_hour: nanny.price_per_hour ?? 0,
      country: nanny.location?.country ?? "",
      region: nanny.location?.region ?? "",
      settlement: nanny.location?.settlement ?? "",
      about: nanny.about ?? "",
      characters: nanny.characters?.join(", ") ?? "",
    },
  });

  const onSubmit = async (data: NannyProfileFormData) => {
    const optionalString = (value: string) => {
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    };
    const characters = data.characters
      .split(",")
      .map((character) => character.trim())
      .filter(Boolean);

    const location =
      data.country.trim() && data.region.trim() && data.settlement.trim()
        ? {
            country: data.country.trim(),
            region: data.region.trim(),
            settlement: data.settlement.trim(),
          }
        : undefined;

    const payload: UpdateNannyProfilePayload = {
      avatar_url: optionalString(data.avatar_url),
      birthday: optionalString(data.birthday),
      experience: optionalString(data.experience),
      education: optionalString(data.education),
      kids_age: optionalString(data.kids_age),
      price_per_hour: data.price_per_hour > 0 ? data.price_per_hour : undefined,
      location,
      about: optionalString(data.about),
      characters: characters.length ? characters : undefined,
    };

    const response = await updateMyNannyProfile(payload);
    onSaved(response.data);
  };

  const inputClassName =
    "h-[44px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-4 text-base outline-none transition focus:border-brand";

  const textareaClassName =
  "min-h-24 w-full resize-y rounded-xl border border-[rgba(17,16,28,0.1)] px-4 py-3 text-base whitespace-pre-wrap break-words outline-none transition focus:border-brand";
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Avatar url:</label>
        <input
          type="text"
          {...register("avatar_url")}
          className={inputClassName}
        />
        {errors.avatar_url && (
          <p style={{ color: "red" }}>{errors.avatar_url.message}</p>
        )}
      </div>
      <div>
        <label>Birthday</label>
        <input
          type="date"
          {...register("birthday")}
          className={inputClassName}
        />
        {errors.birthday && (
          <p style={{ color: "red" }}>{errors.birthday.message}</p>
        )}
      </div>
      <div>
        <label>Experience:</label>
        <input
          type="text"
          {...register("experience")}
          className={inputClassName}
        />
        {errors.experience && (
          <p style={{ color: "red" }}>{errors.experience.message}</p>
        )}
      </div>
      <div>
        <p>Education:</p>
        <textarea {...register("education")} className={textareaClassName} />
        {errors.education && (
          <p style={{ color: "red" }}>{errors.education.message}</p>
        )}
      </div>
      <div>
        <label>Kids age:</label>
        <input
          type="text"
          {...register("kids_age")}
          className={inputClassName}
        />
        {errors.kids_age && (
          <p style={{ color: "red" }}>{errors.kids_age.message}</p>
        )}
      </div>
      <div>
        <label>Price per hour:</label>
        <input
          type="number"
          {...register("price_per_hour", { valueAsNumber: true })}
          className={inputClassName}
        />
        {errors.price_per_hour && (
          <p style={{ color: "red" }}>{errors.price_per_hour.message}</p>
        )}
      </div>
      <div>
        <p>About</p>
        <textarea {...register("about")} className={textareaClassName} />
        {errors.about && <p style={{ color: "red" }}>{errors.about.message}</p>}
      </div>
      <div>
        <p>Characters:</p>
        <textarea {...register("characters")} className={textareaClassName} />
        {errors.characters && (
          <p style={{ color: "red" }}>{errors.characters.message}</p>
        )}
      </div>

      <div>
        <label>Country:</label>
        <input
          type="text"
          {...register("country")}
          className={inputClassName}
        />
        {errors.country && (
          <p style={{ color: "red" }}>{errors.country.message}</p>
        )}
      </div>
      <div>
        <label>Region:</label>
        <input type="text" {...register("region")} className={inputClassName} />
        {errors.region && (
          <p style={{ color: "red" }}>{errors.region.message}</p>
        )}
      </div>
      <div>
        <label>Settlement:</label>
        <input
          type="text"
          {...register("settlement")}
          className={inputClassName}
        />
        {errors.settlement && (
          <p style={{ color: "red" }}>{errors.settlement.message}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="md">
          Save profile
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
