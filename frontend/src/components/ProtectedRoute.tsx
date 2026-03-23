import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
  role?: "admin" | "kiosco";
}

export default function ProtectedRoute({ children, role }: Props) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "kiosco") return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
