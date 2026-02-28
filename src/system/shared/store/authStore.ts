import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { isTokenExpired } from '../services/token.service';

interface AuthUser {
    user_id: number | null;
    role_cd: string | null;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    setAuth: (token: string | null) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                token: null,
                setAuth: (token) =>
                    set({
                        token,
                    }),
                logout: () =>
                    set({
                        user: null,
                        token: null,
                    }),
                isAuthenticated: () => {
                    const token = get().token;
                    return !!token && !isTokenExpired(token);
                },
            }),
            {
                name: 'auth-storage',
            }
        ),
        { name: 'AuthStore' }
    )
);
