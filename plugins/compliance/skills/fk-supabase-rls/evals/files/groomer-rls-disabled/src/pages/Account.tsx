import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Account({ userId }: { userId: string }) {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => setCustomer(data));
  }, [userId]);

  async function save(changes: { phone: string; dog_notes: string }) {
    await supabase.from('customers').update(changes).eq('user_id', userId);
  }

  if (!customer) return null;
  return <AccountForm customer={customer} onSave={save} />;
}
