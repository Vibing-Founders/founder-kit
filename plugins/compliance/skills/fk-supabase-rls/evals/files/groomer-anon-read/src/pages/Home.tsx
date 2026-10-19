import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Shown to logged-out visitors: greys out slots that are already booked.
export default function Home() {
  const [taken, setTaken] = useState<string[]>([]);
  useEffect(() => {
    supabase
      .from('bookings')
      .select('*')
      .gte('starts_at', new Date().toISOString())
      .then(({ data }) => setTaken((data ?? []).map((b) => b.starts_at)));
  }, []);
  return <Calendar takenSlots={taken} />;
}
