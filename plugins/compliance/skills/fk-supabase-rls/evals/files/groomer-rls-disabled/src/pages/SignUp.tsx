import { supabase } from '@/integrations/supabase/client';

export async function completeProfile(userId: string, form: { full_name: string; email: string; phone: string; home_address: string; dog_name: string }) {
  return supabase.from('customers').insert({ user_id: userId, ...form });
}
