import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MyAppointmentsView from "@/components/appointments/MyAppointmentsView";
import { Role } from "@/types/types";

export default function MyAppointmentsPage() {
  return (
    <main className="app-container py-10">
      <ProtectedRoute allowedRoles={[Role.PARENT]}>
        <MyAppointmentsView />
      </ProtectedRoute>
    </main>
  );
}
