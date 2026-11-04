import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from '@phosphor-icons/react'
import { projectBrands } from '../content/project-brands'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

function BrandRow({ duplicate = false }) {
  return <ul className="flex w-max shrink-0 items-center gap-12 py-5 pr-12 sm:gap-16 sm:pr-16" aria-hidden={duplicate || undefined}>
    {projectBrands.map(brand => <li key={brand.id} title={brand.name} className="flex h-12 min-w-24 shrink-0 items-center justify-center gap-3">
      <img src={brand.image} alt={brand.wordmark && !duplicate ? brand.name : ''} width="140" height="44" loading="lazy" className={cn('object-contain', brand.wordmark ? 'h-11 w-30' : 'size-10')} />
      {!brand.wordmark && <span className="whitespace-nowrap text-base font-medium tracking-tight text-slate-600">{brand.name}</span>}
    </li>)}
  </ul>
}

export function ProjectBrands() {
  const reduced = useReducedMotion(), [paused, setPaused] = useState(false)
  return <section aria-label="Entreprises, clients et projets" className="flex flex-col gap-2 border-b border-neutral-100 py-5 sm:flex-row sm:items-center sm:gap-8 sm:py-4">
    <p className="shrink-0 px-6 text-[11px] leading-relaxed text-neutral-400 sm:w-49 sm:pr-0 sm:pl-10 lg:w-57 lg:pl-16">Des projets menés avec<br className="hidden sm:block"/> des entreprises et des clients</p>
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <div className={cn('group min-w-0 flex-1', reduced ? 'overflow-x-auto' : 'overflow-hidden')}>
        <div className={cn('flex w-max', !reduced && 'project-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]')} style={!reduced ? { animationPlayState: paused ? 'paused' : undefined } : undefined}>
          <BrandRow/>{!reduced && <BrandRow duplicate/>}
        </div>
      </div>
      {!reduced && <Button variant="ghost" size="icon" className="mr-4 size-9 shrink-0 text-slate-400 sm:mr-6 lg:mr-12" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Reprendre le défilement des logos' : 'Mettre en pause le défilement des logos'} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}</Button>}
    </div>
  </section>
}
