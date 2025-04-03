import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <>
    <h1 className="h-screen flex items-center justify-center">
        Home Page
    </h1>
    </>
  );
}
