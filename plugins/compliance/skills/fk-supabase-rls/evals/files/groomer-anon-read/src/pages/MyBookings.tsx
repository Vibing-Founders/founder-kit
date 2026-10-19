import { supabase } from '@/integrations/supabase/client';

export async function myBookings(userId: string) {
  const { data } = await supabase
    .from('bookings')
    .select('id, dog_name, starts_at')
    .eq('user_id', userId)
    .order('starts_at');
  return data ?? [];
}

export async function createBooking(form: { customer_name: string; email: string; phone: string; home_address: string; dog_name: string; starts_at: string }) {
  return supabase.from('bookings').insert(form);
}

export async function cancelBooking(id: string) {
  return supabase.from('bookings').delete().eq('id', id);
}
