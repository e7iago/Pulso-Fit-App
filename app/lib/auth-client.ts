import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";


const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    plugins:[
        adminClient()
    ]
});

export const { useSession, signIn, signUp, signOut, admin } = authClient;