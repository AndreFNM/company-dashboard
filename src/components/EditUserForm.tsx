"use client";

import { useEffect, useState } from "react";

export default function EditProfileForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/edit-users");
        if (!res.ok) {
          setMessage("Erro ao carregar os dados do utilizador.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setName(data.name || "");
        setPhone(data.phone || "");
      } catch (error) {
        console.error("Error searching for users:", error);
        setMessage("Erro de rede.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      setMessage("A nova password e a confirmação não coincidem.");
      return;
    }

    const res = await fetch("/api/edit-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        currentPassword,
        newPassword: newPassword || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Erro ao atualizar o perfil.");
      return;
    }

    setMessage("Perfil atualizado com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (loading) {
    return <p className="text-green-500">A carregar os dados...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto mt-8">
      {message && (
        <p className="text-sm text-center text-green-500">{message}</p>
      )}

      <div>
        <label className="block mb-1">Nome</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Número de Telemóvel</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="pt-4 border-t border-gray-600">
        <label className="block mb-1">Password atual</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Nova Password</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Confirmar nova Password</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Guardar alterações
      </button>
    </form>
  );
}
