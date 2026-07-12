'use server';

import { createClient } from '@/lib/supabase/server';
import { ApplicationCard } from '@/types/application';

export async function getApplications(): Promise<{
  data: ApplicationCard[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('applications')
    .select(
      'id, company, role, location, status, source, salary, notes, applied_at, last_activity_at, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
