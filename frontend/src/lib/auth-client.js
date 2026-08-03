import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  // Use same origin so Vite proxy can forward cookies correctly in dev
  // In production, frontend and backend must be served from same domain
  baseURL: typeof window !== 'undefined' ? window.location.origin : (import.meta.env.VITE_API_URL || ''),
});

export const { signIn, signOut, useSession } = authClient;
