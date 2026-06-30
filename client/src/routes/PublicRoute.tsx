import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "@/components/Loader";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
