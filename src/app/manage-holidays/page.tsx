'use client';

import ProtectedRoute from "@/components/ProtectedRoute";

export default function HolidyasManagementPage() {
  return (
    <ProtectedRoute>
      <h1 className="h-screen flex items-center justify-center">
        Ver Marcação de Férias
      </h1>
    </ProtectedRoute>
  );
}
