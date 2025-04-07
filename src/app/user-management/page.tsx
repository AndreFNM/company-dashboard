"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  position: string;
};

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin-users");
      const data = await res.json();
      setUsers(data.users || []);
    }

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    const confirmDelete = confirm("Tem a certeza que quer eliminar este utilizador?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin-users/${userId}`, {
      method: "DELETE",
    });    

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Erro ao eliminar utilizador.");
      return;
    }

    setUsers(users.filter((u) => u.id !== userId));
    setMessage("Utilizador eliminado com sucesso.");
  };

  return (
    <div className="min-h-screen space-y-6 p-16 sm:ml-64 bg-gray-800">
      {message && <p className="text-green-500">{message}</p>}

      <table className="w-full text-sm text-left border border-gray-700">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Email</th>
            <th className="p-3">Cargo</th>
            <th className="p-3">Role</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-600 bg-gray-900">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.position}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 space-x-2">
                {user.role === "USER" && (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                )}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
