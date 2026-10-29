import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchMe,
  getToken,
  loginRequest,
  removeAvatarRequest,
  setToken,
  signupRequest,
  TOKEN_KEY,
  updateProfileRequest,
  uploadAvatarRequest,
  type AuthUser,
} from "@/lib/admin-api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (data: { name: string; email: string; password: string; organization?: string }) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateProfile: (data: { name?: string; organization?: string }) => Promise<AuthUser>;
  uploadAvatar: (image: Blob) => Promise<AuthUser>;
  removeAvatar: () => Promise<AuthUser>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Only wait on /me when a token exists; anonymous visitors render signed-out immediately.
  const [loading, setLoading] = useState(() => getToken() !== null);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { user: me } = await fetchMe();
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  // Keep tabs in sync: signing in or out in one tab updates the others.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY) void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const result = await loginRequest(email, password);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      signup: async (data) => {
        const result = await signupRequest(data);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      logout: () => {
        setToken(null);
        setUser(null);
      },
      refresh,
      updateProfile: async (data) => {
        const result = await updateProfileRequest(data);
        setUser(result.user);
        return result.user;
      },
      uploadAvatar: async (image) => {
        const result = await uploadAvatarRequest(image);
        setUser(result.user);
        return result.user;
      },
      removeAvatar: async () => {
        const result = await removeAvatarRequest();
        setUser(result.user);
        return result.user;
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
