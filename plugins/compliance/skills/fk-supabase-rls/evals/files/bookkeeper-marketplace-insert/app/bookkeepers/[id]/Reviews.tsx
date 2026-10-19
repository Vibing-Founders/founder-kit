'use client';
import { supabase } from '@/lib/supabase';

export async function loadReviews(bookkeeperId: string) {
  const { data } = await supabase
    .from('reviews')
    .select('rating, body, created_at, author:profiles!author_id(display_name)')
    .eq('bookkeeper_id', bookkeeperId);
  return data ?? [];
}
