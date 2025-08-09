'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';

export default function SessionSync() {
  const { refreshUser, setUser, setUserCountry } = useAppStore();

  useEffect(() => {
    const supabase = createClient();

    // Initial bootstrap on mount
    refreshUser()
      .then(() => {
        const state = useAppStore.getState();
        if (state.user) setUserCountry(state.user.country);
      })
      .catch(() => {});

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


