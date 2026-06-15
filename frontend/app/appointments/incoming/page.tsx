import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Role } from "@/types/types";

export default function IncomingAppointmentsPage() {
  return (
    <main className="app-container py-10">
      <ProtectedRoute allowedRoles={[Role.NANNY]}>
        <h1 className="text-3xl font-medium">Incoming appointments</h1>
        <p className="mt-4 text-(--color-muted)">
          Appointment requests from parents will appear here.
        </p>
      </ProtectedRoute>
    </main>
  );
}
