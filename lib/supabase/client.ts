import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    // Return a mock client for static build
    return {
      auth: {
        onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
        getUser: async () => ({ data: { user: null } }),
        signInWithPassword: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({
              data: [],
              error: null,
            }),
          }),
        }),
        insert: async () => ({ error: null }),
        delete: async () => ({ error: null }),
        update: async () => ({ error: null }),
      }),
    } as any
  }
  
  return createBrowserClient(url, key)
}
