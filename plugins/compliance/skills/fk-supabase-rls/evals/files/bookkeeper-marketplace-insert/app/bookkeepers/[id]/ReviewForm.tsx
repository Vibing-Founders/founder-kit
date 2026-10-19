'use client';
import { supabase } from '@/lib/supabase';

export async function submitReview(bookkeeperId: string, rating: number, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('reviews').insert({
    bookkeeper_id: bookkeeperId,
    author_id: user!.id,
    rating,
    body,
  });
}
