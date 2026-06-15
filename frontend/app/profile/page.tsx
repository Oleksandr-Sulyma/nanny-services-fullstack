import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfileView from "@/components/profile/UserProfileView";

export default function ProfilePage() {
  return (
    <main className="app-container py-10">
      <h1 className="text-3xl font-medium">My profile</h1>
      <div className="mt-8">
        <ProtectedRoute>
          <UserProfileView />
        </ProtectedRoute>
      </div>
    </main>
  );
}
