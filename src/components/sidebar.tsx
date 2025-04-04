'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";  
import {
    ArrowTrendingDownIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    CalendarDaysIcon,
    IdentificationIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';

const navItems = [
    { label: 'Lista de Funcionários', href: '/dashboard', icon: ListBulletIcon },
    { label: 'Marcar Férias', href: '/book-holidays', icon: CalendarDaysIcon },
    { label: 'Definições do Perfil', href: '/transactions', icon: Cog6ToothIcon },
    { label: 'Gestão de Utilizadores', href: '/user-management', icon: IdentificationIcon, role: 'ADMIN' }, 
    { label: 'Ver Férias', href: '/manage-holidays', icon: CalendarDaysIcon, role: 'ADMIN' }, 
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
        } else {
            setIsSessionLoading(false);
        }
    }, [session, status, router]);

    if (isSessionLoading || status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null; 
    }

    return (
        <aside className="flex flex-col justify-between h-screen w-64 bg-gray-900 text-white p-4 fixed">
            <div>
                <div className="mb-10 text-2xl font-bold"><span className="text-indigo-400">C</span><span className="text-purple-500">Dashboard</span></div>

                <nav className="space-y-2">
                    {navItems.map(({ label, href, icon: Icon, role }) => {
                        if (role && session.user.role !== role) return null;

                        const isActive = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all
                                ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                            >
                                <Icon className="h-5 w-5" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-4">
                <button
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 text-sm"
                    onClick={() => signOut()}>
                    <ArrowTrendingDownIcon className="h-5 w-5" />
                    Logout
                </button>

                <div className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium">{session?.user?.name}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
