import { publicKey } from '../../supabase/functions/portfolio-inquiry/public-config.js'

export async function sendProjectRequest(payload, signal) {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = publicKey
  if (!url || !key) throw new Error('L’envoi est momentanément indisponible. Vous pouvez me transmettre votre demande directement par e-mail.')
  const response = await fetch(`${url}/functions/v1/portfolio-inquiry`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Accept: 'application/json' }, credentials: 'omit', signal, body: JSON.stringify(payload) })
  return { response, result: await response.json().catch(() => null) }
}
