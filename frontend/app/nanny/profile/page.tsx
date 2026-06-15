import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NannyProfileView from "@/components/nanny-profile/NannyProfileView";
import { Role } from "@/types/types";

export default function NannyProfilePage() {
  return (
    <main className="app-container py-10">
      <h1 className="text-3xl font-medium">My profile</h1>
      <p className="mt-4 text-(--color-muted)">
        Complete your nanny profile to start receiving appointments.
      </p>

      <div className="mt-8">
        <ProtectedRoute allowedRoles={[Role.NANNY]}>
          <NannyProfileView />
        </ProtectedRoute>
      </div>
    </main>
  );
}
