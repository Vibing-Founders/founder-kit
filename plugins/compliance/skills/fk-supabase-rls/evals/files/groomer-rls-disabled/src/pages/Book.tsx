import { supabase } from '@/integrations/supabase/client';

export async function loadServices() {
  const { data } = await supabase.from('services').select('id, name, duration_minutes, price_pence');
  return data ?? [];
}

export async function book(customerId: string, serviceId: string, startsAt: string) {
  return supabase
    .from('appointments')
    .insert({ customer_id: customerId, service_id: serviceId, starts_at: startsAt });
}

export async function myAppointments() {
  const { data } = await supabase
    .from('appointments')
    .select('id, starts_at, services(name)')
    .order('starts_at');
  return data ?? [];
}
