import React, { type FC } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "@/components/Loader";
import { useProfile } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isLoading } = useProfile();

  const { isAuthenticated, user, isHydrated } = useAuthStore();

  if (!isHydrated || isLoading) return <Loader />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
