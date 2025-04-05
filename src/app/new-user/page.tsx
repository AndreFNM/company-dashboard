'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import CreateUserForm from "@/components/CreateUserForm";

export default function NovoUtilizadorPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="p-16 sm:ml-64 bg-gray-900 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Utilizador</h1>
        <CreateUserForm />
      </div>
    </ProtectedRoute>
  );
}
