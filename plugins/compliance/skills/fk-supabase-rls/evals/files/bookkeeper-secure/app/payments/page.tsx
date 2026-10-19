'use client';
import { supabase } from '@/lib/supabase';

export async function myPayments() {
  const { data } = await supabase.from('payments').select('amount_pence, paid_at').order('paid_at');
  return data ?? [];
}
