import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FavoritesView from "@/components/favorites/FavoritesView";
import { Role } from "@/types/types";

export default function Favorites() {
  return (
    <main className="app-container py-6 md:py-4">
      <ProtectedRoute allowedRoles={[Role.PARENT]}>
        <FavoritesView />
      </ProtectedRoute>
    </main>
  );
}
