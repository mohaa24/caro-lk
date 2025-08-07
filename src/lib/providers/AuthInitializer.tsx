'use client';

import { useEffect } from 'react';
import { useInitializeAuth } from '../hooks/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  // Initialize auth once when the app starts
  useInitializeAuth();

  return <>{children}</>;
}
