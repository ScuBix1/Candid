'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateApplicationSchema } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';

export async function updateApplication(id: string, data: CreateApplicationSchema) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('applications')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { error: null };
}
