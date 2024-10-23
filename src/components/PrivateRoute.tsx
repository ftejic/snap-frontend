import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/types";
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, admin }: { children: React.ReactNode, admin? : boolean }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === Role.Admin && !admin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
