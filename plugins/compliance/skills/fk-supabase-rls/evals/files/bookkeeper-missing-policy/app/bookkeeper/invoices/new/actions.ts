'use client';
import { supabase } from '@/lib/supabase';

export async function sendInvoice(clientId: string, amountPence: number, dueDate: string) {
  return supabase.from('invoices').insert({ client_id: clientId, amount_pence: amountPence, due_date: dueDate });
}
