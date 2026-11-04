import sharp from 'sharp'
import { stat } from 'node:fs/promises'

const assets = [
  ['portrait-hq-transparent.png', 84],
  ['dakar.png', 78],
  ['school.png', 78],
  ['real-estate.png', 78],
  ['maritime.png', 78],
]

for (const [name, quality] of assets) {
  const source = `public/images/${name}`
  const output = source.replace(/\.png$/i, '.webp')
  const pipeline = sharp(source).rotate()
  if (name !== 'portrait-hq-transparent.png') pipeline.resize({ width: 1500, withoutEnlargement: true })
  await pipeline.webp({ quality, alphaQuality: 90, effort: 6 }).toFile(output)
  console.log(`${name} → ${output} (${Math.round((await stat(output)).size / 1024)} KB)`)
}
