'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateApplicationSchema } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';

export async function createApplication(data: CreateApplicationSchema) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('applications').insert({
    ...data,
    user_id: user.id,
    status: 'sent',
  });

  if (error) return { error: error.message };

  revalidatePath('/dashboard');

  return { error: null };
}
