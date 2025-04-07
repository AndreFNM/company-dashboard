"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function EditProfileForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

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
        setImageUrl(data.imageUrl || "");
      } catch (error) {
        console.error("Erro de rede:", error);
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

    let uploadedImageUrl = imageUrl;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setMessage("Erro ao fazer upload da imagem.");
          return;
        }

        uploadedImageUrl = uploadData.filepath;
        setImageUrl(uploadData.filepath);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem: ", error);
        setMessage("Erro ao fazer upload da imagem.");
        return;
      }
    }

    const res = await fetch("/api/edit-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        currentPassword,
        newPassword: newPassword || undefined,
        imageUrl: uploadedImageUrl,
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

  const clearMessage = () => {
    if (message) setMessage("");
  };

  if (loading) {
    return <p className="text-green-500">A carregar os dados...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-xl mx-auto mt-8"
      onClick={clearMessage}
      onKeyDown={clearMessage}
    >
      {message && (
        <p className="text-sm text-center text-green-500">{message}</p>
      )}

      {imageUrl && (
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={imageUrl}
              alt="Foto de perfil"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block mb-1">Nome</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearMessage();
          }}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Número de Telemóvel</label>
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearMessage();
          }}
        />
      </div>

      <div className="pt-4 border-t border-gray-600">
        <label className="block mb-1">Atualizar imagem de perfil</label>
        <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={(e) => {
            setImage(e.target.files?.[0] || null);
            clearMessage();
          }}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="inline-block px-4 py-2 bg-gray-700 text-white text-sm rounded cursor-pointer hover:bg-gray-600 transition duration-200"
        >
           Escolher nova foto
        </label>
        {image && (
          <p className="text-sm text-gray-400 mt-1">Imagem selecionada: {image.name}</p>
        )}
      </div>
      </div>

      <div className="pt-4 border-t border-gray-600">
        <label className="block mb-1">Password atual</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            clearMessage();
          }}
        />
      </div>

      <div>
        <label className="block mb-1">Nova Password</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            clearMessage();
          }}
        />
      </div>

      <div>
        <label className="block mb-1">Confirmar nova Password</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearMessage();
          }}
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
