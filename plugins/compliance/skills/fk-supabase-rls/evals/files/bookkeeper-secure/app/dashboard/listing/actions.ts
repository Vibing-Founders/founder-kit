'use client';
import { supabase } from '@/lib/supabase';

export async function myListings() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('listings')
    .select('id, headline, hourly_rate_pence, published')
    .eq('bookkeeper_id', user!.id);
  return data ?? [];
}

export async function createListing(headline: string, hourlyRatePence: number) {
  return supabase.from('listings').insert({ headline, hourly_rate_pence: hourlyRatePence });
}

export async function publishListing(id: string, published: boolean) {
  return supabase.from('listings').update({ published }).eq('id', id);
}
