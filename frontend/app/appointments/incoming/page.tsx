import ProtectedRoute from "@/components/auth/ProtectedRoute";
import IncomingAppointmentsView from "@/components/appointments/IncomingAppointmentsView";
import { Role } from "@/types/types";

export default function IncomingAppointmentsPage() {
  return (
    <main className="app-container py-10">
      <ProtectedRoute allowedRoles={[Role.NANNY]}>
        <IncomingAppointmentsView />
      </ProtectedRoute>
    </main>
  );
}
