'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';


interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      window.location.href = '/login';
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error getting users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 ml-64 p-8">
    <h1 className="text-2xl font-semibold text-white mb-4">Lista de Funcionários</h1>
    <table className="min-w-full bg-gray-800 text-white rounded-md">
      <thead>
        <tr className="border-b border-gray-600">
          <th className="px-4 py-2 text-left text-sm">Foto</th>
          <th className="px-6 py-2 text-left text-sm">Nome</th>
          <th className="px-6 py-2 text-left text-sm">Email</th>
          <th className="px-6 py-2 text-left text-sm">Função</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-600">
            <td className="px-4 py-2 flex justify-center">
              <Image
                src={user.imageUrl || "/default-avatar.png"}
                alt="Foto"
                width={30}
                height={30}
                className="rounded-full"
              />
            </td>
            <td className="px-6 py-2 text-sm">{user.name}</td>
            <td className="px-6 py-2 text-sm">{user.email}</td>
            <td className="px-6 py-2 text-sm">{user.position}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}