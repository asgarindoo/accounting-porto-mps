import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: 'http://localhost:5000', // Backend base URL
});

export const { signIn, signOut, useSession } = authClient;
