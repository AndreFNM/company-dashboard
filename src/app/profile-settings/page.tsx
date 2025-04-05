'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import EditUserForm from "@/components/EditUserForm";

export default function UserSettingsPage() {
  return (
    <ProtectedRoute>
      <div className="p-16 sm:ml-64 bg-gray-800 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
        <EditUserForm />
      </div>
    </ProtectedRoute>
  );
}
