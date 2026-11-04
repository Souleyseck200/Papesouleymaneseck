export async function sendProjectRequest(payload, signal) {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('L’envoi est momentanément indisponible. Vous pouvez me transmettre votre demande directement par e-mail.')
  const response = await fetch(`${url}/functions/v1/portfolio-inquiry`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Accept: 'application/json' }, credentials: 'omit', signal, body: JSON.stringify(payload) })
  return { response, result: await response.json().catch(() => null) }
}
