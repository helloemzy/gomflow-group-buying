'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';

export default function SessionSync() {
  const { refreshUser, setUser, setUserCountry } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();

    // If we just returned from OAuth: exchange code for a client session and clean the URL
    const code = searchParams.get('code');
    if (code) {
      supabase.auth
        .exchangeCodeForSession(window.location.search)
        .then(async () => {
          await refreshUser();
          const state = useAppStore.getState();
          if (state.user) setUserCountry(state.user.country);
          router.replace('/');
        })
        .catch(() => {
          // no-op; UI will still work with server session
          router.replace('/');
        });
    } else {
      // Initial bootstrap on mount
      refreshUser()
        .then(() => {
          const state = useAppStore.getState();
          if (state.user) setUserCountry(state.user.country);
        })
        .catch(() => {});
    }

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await refreshUser();
        const state = useAppStore.getState();
        if (state.user) setUserCountry(state.user.country);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [refreshUser, setUser, setUserCountry]);

  return null;
}


