'use client';
import { supabase } from '@/lib/supabase';

export async function sendMessage(recipientId: string, body: string) {
  return supabase.from('messages').insert({ recipient_id: recipientId, body });
}

export async function loadThread(otherUserId: string) {
  const { data } = await supabase
    .from('messages')
    .select('id, sender_id, body, sent_at')
    .or(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
    .order('sent_at');
  return data ?? [];
}
