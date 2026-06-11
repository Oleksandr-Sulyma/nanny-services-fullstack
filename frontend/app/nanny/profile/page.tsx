import NannyProfileView from "@/components/nanny-profile/NannyProfileView";

export default function NannyProfilePage() {
  return (
    <main className="app-container py-10">
      <h1 className="text-3xl font-medium">My profile</h1>
      <p className="mt-4 text-(--color-muted)">
        Complete your nanny profile to start receiving appointments.
      </p>

      <div className="mt-8">
        <NannyProfileView />
      </div>
    </main>
  );
}