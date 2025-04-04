'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; 
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      setIsAuthenticated(false);
      router.push("/login"); 
    } else {
      if (requiredRole && session.user.role !== requiredRole) {
        setIsAuthenticated(false);
        router.push("/login");  
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [session, status, router, requiredRole]);

  if (status === 'loading') {
    return null; 
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
