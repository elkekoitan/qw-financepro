import { createContext, useContext, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient;
}

interface SupabaseProviderProps {
  children: ReactNode;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase(): SupabaseContextType {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseContext; 