import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Member } from '../types';
import { getMemberId, saveMemberId, clearMemberId } from '../services/storage';
import { getMember, login as apiLogin, register as apiRegister } from '../services/mockApi';

interface AuthContextValue {
  member: Member | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (member: Omit<Member, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = await getMemberId();
      if (id) {
        const m = await getMember(id);
        if (m) setMember(m);
      }
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    member,
    loading,
    login: async (phone: string, password: string) => {
      const m = await apiLogin(phone, password);
      setMember(m);
      await saveMemberId(m.id);
    },
    register: async (payload: Omit<Member, 'id'>) => {
      const m = await apiRegister(payload);
      setMember(m);
      await saveMemberId(m.id);
    },
    logout: async () => {
      setMember(null);
      await clearMemberId();
    },
  }), [member, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
