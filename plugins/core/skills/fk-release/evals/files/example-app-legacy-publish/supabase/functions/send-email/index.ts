import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const apiKey = Deno.env.get('EMAIL_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'EMAIL_API_KEY is not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const { to, subject, body } = await req.json();
  const res = await fetch('https://email.example.com/v1/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body }),
  });
  return new Response(JSON.stringify({ ok: res.ok }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
