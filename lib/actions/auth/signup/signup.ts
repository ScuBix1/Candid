'use server';

import { createClient } from '@/lib/supabase/server';

export async function signUp(email: string, displayName: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) return { error: error.message };
  return { error: null };
}
