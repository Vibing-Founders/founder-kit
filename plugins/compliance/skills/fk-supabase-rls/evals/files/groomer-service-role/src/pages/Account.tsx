import { supabase } from '@/integrations/supabase/client';

export async function loadMe() {
  const { data } = await supabase.from('customers').select('full_name, phone, dog_name').single();
  return data;
}
