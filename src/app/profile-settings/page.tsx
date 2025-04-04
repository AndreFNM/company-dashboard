'use client';

import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserSettingsPage() {
  return (
    <ProtectedRoute >
      <h1 className="h-screen flex items-center justify-center">
        Definições do Perfil
      </h1>
    </ProtectedRoute>
  );
}
