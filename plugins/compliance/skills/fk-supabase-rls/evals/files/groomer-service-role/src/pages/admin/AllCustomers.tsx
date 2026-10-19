import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default function AllCustomers() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabaseAdmin
      .from('customers')
      .select('full_name, email, phone, dog_name')
      .order('full_name')
      .then(({ data }) => setRows(data ?? []));
  }, []);
  return <CustomerTable rows={rows} />;
}
