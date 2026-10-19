import { supabase } from '@/integrations/supabase/client';

// Function written in the Supabase SQL editor; works for logged-out visitors too.
export async function availableSlots(day: string) {
  const { data } = await supabase.rpc('get_available_slots', { day });
  return data ?? [];
}
