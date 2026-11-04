import { createInquiryHandler } from './handler.js'
import { createStore, createResendMail } from './services.js'
import { publicKey, defaultOrigins } from './public-config.js'

const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
const secret = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const origins = Deno.env.get('PORTFOLIO_ALLOWED_ORIGINS')?.split(',').map(value => value.trim()).filter(Boolean) || defaultOrigins
const handler = createInquiryHandler({
  publicKey, allowedOrigins: origins, ipSalt: secret,
  store: createStore(Deno.env.get('SUPABASE_URL') || '', secret),
  mail: createResendMail(Deno.env.get('PORTFOLIO_RESEND_API_KEY') || '', Deno.env.get('PORTFOLIO_MAIL_FROM') || ''),
})
Deno.serve(handler)
