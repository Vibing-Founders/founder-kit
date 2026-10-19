import { supabase } from '@/lib/supabase';

export default async function Listings() {
  const { data } = await supabase
    .from('listings')
    .select('id, headline, hourly_rate_pence')
    .eq('published', true);
  return <ListingGrid listings={data ?? []} />;
}
