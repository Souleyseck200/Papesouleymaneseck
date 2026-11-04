import sharp from 'sharp'

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="90" fill="#d7ff52"/>
  <g fill="none" stroke="#101820" stroke-linecap="round" stroke-width="12">
    <path d="M90 42v96M48.5 66l83 48M131.5 66l-83 48"/>
  </g>
</svg>`)

await sharp(svg).resize(48, 48).png().toFile('public/favicon-48.png')
await sharp(svg).png().toFile('public/apple-touch-icon.png')
