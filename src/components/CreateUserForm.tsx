"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/create-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, position, phone, role, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Erro ao criar utilizador.");
      return;
    }

    setMessage("Utilizador criado com sucesso!");
    setName("");
    setEmail("");
    setPosition("");
    setPhone("");
    setRole("USER");
    setPassword("");
  };

  const clearMessage = () => {
    if (message) setMessage("");
  };


  return (
    <form 
      onSubmit={handleSubmit} 
      onClick={clearMessage}
      onKeyDown={clearMessage}
      className="space-y-6 max-w-xl mx-auto mt-8">
      {message && <p className="text-green-500 text-center">{message}</p>}

      <div>
        <label className="block mb-1">Nome</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={name}
          onChange={(e) =>{ 
            setName(e.target.value);
            clearMessage();
          }}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearMessage();
          }}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Cargo</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={position}
          onChange={(e) => {
            setPosition(e.target.value)
            clearMessage();
          }}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Telefone</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearMessage();
          }}
        />
      </div>

      <div>
        <label className="block mb-1">Palavra-passe</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearMessage();
          }}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Tipo</label>
        <select
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as "USER" | "ADMIN");
            clearMessage();
          }}
        >
          <option value="USER">Utilizador</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Criar utilizador
      </button>
    </form>
  );
}
