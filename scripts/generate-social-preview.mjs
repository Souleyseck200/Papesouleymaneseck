import sharp from 'sharp'

const width = 1200
const height = 630
const background = Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1528"/><stop offset="1" stop-color="#172640"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="#28476b" stop-opacity=".6"/><stop offset="1" stop-color="#28476b" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="970" cy="340" rx="380" ry="360" fill="url(#glow)"/>
  <circle cx="83" cy="83" r="18" fill="#d7ff52"/>
  <path d="M75 83h16M83 75v16" stroke="#0b1528" stroke-width="2.5" stroke-linecap="round"/>
  <text x="120" y="91" fill="#f5f7fb" font-family="Arial, sans-serif" font-size="24" font-weight="600">Pape Souleymane Seck</text>
  <text x="80" y="220" fill="#d7ff52" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="2">DÉVELOPPEUR FULL-STACK</text>
  <text x="80" y="294" fill="#ffffff" font-family="Arial, sans-serif" font-size="57" font-weight="700" letter-spacing="-2">Des idées aux</text>
  <text x="80" y="358" fill="#ffffff" font-family="Arial, sans-serif" font-size="57" font-weight="700" letter-spacing="-2">applications réelles.</text>
  <text x="82" y="420" fill="#c7d0df" font-family="Arial, sans-serif" font-size="21">Web · mobile · architecture · données</text>
  <rect x="80" y="482" width="7" height="42" rx="3.5" fill="#ff6b35"/>
  <text x="105" y="510" fill="#f5f7fb" font-family="Arial, sans-serif" font-size="20" font-weight="600">Dakar, Sénégal</text>
  <text x="80" y="583" fill="#aebbd0" font-family="Arial, sans-serif" font-size="17">www.papesouleymaneseck.site</text>
  <path d="M764 0h436v630H764z" fill="#0b1528" fill-opacity=".12"/>
</svg>`)

await sharp({ create: { width, height, channels: 4, background: '#0b1528' } })
  .composite([
    { input: background, left: 0, top: 0 },
    { input: await sharp('public/images/portrait-hq-transparent.webp').resize({ height: 608, fit: 'inside' }).png().toBuffer(), left: 700, top: 22 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/images/og-portfolio.png')

