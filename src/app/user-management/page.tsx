'use client';

import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserManagementPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <h1 className="h-screen flex items-center justify-center">
        Gestão de Utilizadores
      </h1>
    </ProtectedRoute>
  );
}
