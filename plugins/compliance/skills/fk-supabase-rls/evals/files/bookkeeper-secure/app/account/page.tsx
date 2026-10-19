'use client';
import { supabase } from '@/lib/supabase';

export async function loadAccount() {
  const { data } = await supabase.from('profiles').select('display_name, email').single();
  return data;
}

export async function rename(displayName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('profiles').update({ display_name: displayName }).eq('id', user!.id);
}
