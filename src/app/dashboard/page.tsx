import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if(!session) {
        redirect("/login")
    }

    return (
        <>
            <h1 className="h-screen flex items-center justify-center">
               Dashboard Page 
            </h1>
        </>
    )
}