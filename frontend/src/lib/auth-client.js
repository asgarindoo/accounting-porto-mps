import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // Backend base URL
});

export const { signIn, signOut, useSession } = authClient;
