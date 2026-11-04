import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Button } from './ui/button'

const milestones = [
  ['2020 — 2022', 'Les premières réalisations', 'J’apprends avec mon grand frère, puis je réalise des sites vitrines et participe à des projets Arduino.'],
  ['2023 — 2026', 'Axis et les missions clients', 'Je développe des plateformes pour l’éducation, l’immobilier, la sécurité, l’événementiel et le commerce.'],
  ['Formation', 'ISEP Diamniadio', 'Développement Frontend, avec modules backend et projets full-stack. Soutenance validée en 2026. DISEP en attente de délivrance.'],
]

export function AboutSection() {
  const ref = useRef(null), reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24])
  return <section id="parcours" className="scroll-mt-20">
    <div ref={ref} className="relative isolate overflow-hidden bg-navy text-white">
      <motion.img src="/images/portrait-hq-transparent.png" alt="Pape Souleymane Seck" width="1183" height="1329" loading="lazy" style={reduced ? {} : { y: imageY }} className="absolute right-0 bottom-0 -z-10 h-[94%] w-[90%] object-contain object-right-bottom opacity-40 md:w-[54%] md:opacity-100"/>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy via-navy/85 to-navy/10 md:via-navy/75 md:to-transparent"/>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-t from-navy/70 to-transparent"/>
      <div className="relative flex min-h-120 items-center px-6 py-16 sm:px-10 sm:py-20 md:min-h-145 lg:px-16">
        <motion.div initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 12% 0)', y: 18 }} whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="max-w-xl md:max-w-[55%]">
          <p className="mb-6 text-sm text-[#ff9a56]">Derrière les projets</p>
          <h2 className="text-[clamp(2.2rem,4.6vw,5rem)] leading-[1.04] font-bold tracking-[-.045em]">Une pratique complète<br className="hidden sm:block"/> du développement.</h2>
          <p className="mt-7 max-w-112 text-sm leading-[1.8] text-white/70 sm:text-base">Je conçois et développe des applications web et mobiles, de l’interface aux règles métier. J’ai commencé à coder en 2020. Depuis, les projets personnels et les missions clients nourrissent ma pratique au quotidien.</p>
          <Button asChild variant="light" className="mt-8 gap-6 text-xs"><a href="#contact">Échanger sur un projet <ArrowUpRight size={16}/></a></Button>
        </motion.div>
      </div>
    </div>
    <div className="grid gap-7 px-6 py-10 sm:px-10 md:grid-cols-3 md:gap-10 lg:px-16 lg:py-12">
      {milestones.map(([date, name, description]) => <div key={name} className="border-t border-neutral-200 pt-5">
        <p className="mb-3 text-xs text-neutral-400">{date}</p>
        <h3 className="mb-2 text-sm font-medium">{name}</h3>
        <p className="max-w-100 text-xs leading-[1.8] text-neutral-500">{description}</p>
      </div>)}
    </div>
  </section>
}
