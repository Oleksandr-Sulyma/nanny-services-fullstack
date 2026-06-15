"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getMyNannyProfile } from "@/lib/nanniesApi";
import type { Nanny } from "@/types/types";
import Button from "@/components/ui/Button";
import NannyProfileForm from "./NannyProfileForm";
import { formatDate } from "@/lib/date";
import { formatLocationPart } from "@/lib/format";
import ProfileField from "@/components/ui/ProfileField";
import Spinner from "@/components/ui/Spinner";

export default function NannyProfileView() {
  const [nanny, setNanny] = useState<Nanny | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyNannyProfile();
        setNanny(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load profile",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);
  return (
    <div>
      {isLoading && <Spinner />}
      {errorMessage && <p className="text-sm text-brand">{errorMessage}</p>}
      {nanny && (
        <section className="rounded-3xl bg-surface p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              {nanny.avatar_url ? (
                <Image
                  src={nanny.avatar_url}
                  alt={nanny.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-soft text-2xl font-medium text-brand">
                  {nanny.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div>
                <p className="text-sm text-(--color-muted)">Nanny profile</p>
                <h2 className="mt-2 text-2xl font-medium">{nanny.name}</h2>
                <p className="mt-1 text-sm text-(--color-muted)">
                  {nanny.isProfileComplete
                    ? "Complete profile"
                    : "Draft profile"}
                </p>
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
            <NannyProfileForm
              nanny={nanny}
              onCancel={() => setIsEditing(false)}
              onSaved={(updatedNanny) => {
                setNanny(updatedNanny);
                setIsEditing(false);
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField
                label="Status"
                value={nanny.isProfileComplete ? "Complete" : "Draft"}
              />
              <ProfileField label="Name" value={nanny.name} />
              <ProfileField
                label="Birthday"
                value={formatDate(nanny.birthday)}
              />
              <ProfileField label="Experience" value={nanny.experience} />
              <ProfileField label="Kids age" value={nanny.kids_age} />
              <ProfileField
                label="Price per hour"
                value={
                  nanny.price_per_hour
                    ? `$${nanny.price_per_hour} / hour`
                    : null
                }
              />
              <ProfileField label="Education" value={nanny.education} />
              <ProfileField
                label="Characters"
                value={
                  nanny.characters?.length ? nanny.characters.join(", ") : null
                }
              />
              <ProfileField
                label="About"
                value={nanny.about}
                className="md:col-span-2"
              />
              <h3 className="text-lg font-medium md:col-span-2">Location</h3>

              <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
                <ProfileField
                  label="Country"
                  value={
                    nanny.location?.country
                      ? formatLocationPart(nanny.location.country)
                      : null
                  }
                />
                <ProfileField
                  label="Region"
                  value={
                    nanny.location?.region
                      ? formatLocationPart(nanny.location.region)
                      : null
                  }
                />
                <ProfileField
                  label="Settlement"
                  value={
                    nanny.location?.settlement
                      ? formatLocationPart(nanny.location.settlement)
                      : null
                  }
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
