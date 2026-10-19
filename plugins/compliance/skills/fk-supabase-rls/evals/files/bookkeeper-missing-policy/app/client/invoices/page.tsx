'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Clients see the invoices their bookkeeper has sent them.
export default function ClientInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('invoices')
        .select('id, amount_pence, due_date, status')
        .eq('client_id', user!.id)
        .order('due_date');
      setInvoices(data ?? []);
    })();
  }, []);
  if (invoices.length === 0) return <p>No invoices yet.</p>;
  return <InvoiceList invoices={invoices} />;
}
