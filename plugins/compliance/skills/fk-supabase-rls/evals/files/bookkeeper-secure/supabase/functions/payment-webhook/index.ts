// Runs on Supabase Edge Functions (server side). Verifies the payment provider's signature,
// then records the payment with the service role, which RLS does not apply to.
import { createClient } from 'npm:@supabase/supabase-js@2';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const event = await verifyProviderSignature(req); // throws on a bad signature
  if (event.type !== 'payment.succeeded') return new Response('ignored');
  await admin.from('payments').insert({
    payer_id: event.metadata.user_id,
    amount_pence: event.amount,
    provider_ref: event.id,
  });
  return new Response('ok');
});
