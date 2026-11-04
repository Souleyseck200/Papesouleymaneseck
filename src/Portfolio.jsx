import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ArrowUpRight, ArrowLeft, ArrowDown, AsteriskSimple, List, X, Play, Pause, MagnifyingGlass, Database, TreeStructure, EnvelopeSimple, Phone, MapPin, Check } from '@phosphor-icons/react'
import { Button } from './components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { ProjectDiagrams } from './components/project-diagrams'
import { AboutSection } from './components/about-section'
import { ProjectBrands } from './components/project-brands'
import { ProjectRequestForm } from './components/project-request-form'
import { cases as originalCases } from './data'
import { extraCases as originalExtraCases } from './extended'
import { deepProjects } from './content/deep-projects'
import { deepExtras } from './content/deep-extras'
import { ProjectDepth } from './components/project-depth'
import { cn } from './lib/utils'

const enrich = project => {
  const deep=deepProjects[project.id]||deepExtras[project.id]
  return { ...project, role:project.id==='opendevin'?'Adaptation personnelle du projet open source':'Conception et développement réalisés seul', flows:deep?.steps||project.flows, deep,
    ...(project.id==='siggil'?{stack:['React 19','TypeScript','React Router','Context / reducer','Supabase','Tailwind CSS']}:{}),
    ...(project.id==='nps'?{stack:['React 18','TypeScript','Vite','TanStack Query','Supabase','shadcn/ui']}:{}),
  }
}
const cases=originalCases.map(enrich)
const extraCases=originalExtraCases.map(enrich)

const colors = {
  alertsec: { card:'bg-[#cbff49]', soft:'bg-[#f2f8df]', text:'text-[#4b621b]', image:'/images/dakar.webp', short:'Une alerte. Plusieurs acteurs. Un même état de mission.', type:'Sécurité', year:'Projet de fin d’études' },
  edukora: { card:'bg-[#eee9e2]', soft:'bg-[#f8f5ef]', text:'text-[#877357]', image:'/images/school.webp', short:'L’école, ses utilisateurs et ses opérations quotidiennes.', type:'Éducation', year:'Axis' },
  viva: { card:'bg-[#e8e4fc]', soft:'bg-[#f6f3ff]', text:'text-[#7d68b2]', image:'/images/real-estate.webp', short:'Des biens immobiliers aux écritures comptables.', type:'Immobilier', year:'Client · 2026' },
  jokko: { card:'bg-[#dceeff]', soft:'bg-[#f1f7fc]', text:'text-[#4f81aa]', short:'Des messages qui reprennent le fil après une coupure.', type:'Communication', year:'Projet personnel' },
  axis: { card:'bg-[#ffe5d2]', soft:'bg-[#fff4ec]', text:'text-[#b16b32]', short:'Du brief client au dossier de conception assisté par IA.', type:'IA appliquée', year:'Axis' },
  maritime: { card:'bg-[#dceae7]', soft:'bg-[#f0f7f5]', text:'text-[#487b71]', image:'/images/maritime.webp', short:'Transformer une scène satellite en observation située.', type:'Géospatial', year:'Recherche & prototype' },
}

function SectionHeading({ label, title, children }) {
  return <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
    <div><p className="mb-3 text-sm font-medium text-accent">{label}</p><h2 className="max-w-3xl text-[clamp(2rem,4.2vw,4rem)] leading-[1.04] font-bold tracking-[-.055em]">{title}</h2></div>
    {children && <div className="max-w-83 text-sm leading-relaxed text-neutral-500">{children}</div>}
  </div>
}

function Hero({ go }) {
  const ref = useRef(null), reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target:ref, offset:['start start','end start'] })
  const imageY = useTransform(scrollYProgress,[0,1],[0,28])
  return <section ref={ref} id="accueil" className="relative isolate mx-3 overflow-hidden rounded-[28px] bg-navy text-white sm:mx-5 sm:rounded-[36px]">
    <div className="grid px-6 sm:px-10 md:min-h-[clamp(520px,42vw,720px)] md:grid-cols-[1.08fr_1fr] lg:px-[clamp(3rem,5vw,6rem)]">
      <div className="relative z-10 pt-10 pb-2 sm:pt-14 md:self-center md:py-14 lg:py-18">
        <motion.p initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:.6}} className="mb-6 text-sm font-medium text-[#ff9a56]">Bonjour, je suis Pape Souleymane.</motion.p>
        <motion.h1 initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.1,ease:[.22,1,.36,1]}} className="text-[clamp(3.05rem,6.8vw,8rem)] leading-[.98] font-bold tracking-[-.06em]">Développeur<br />full-stack.</motion.h1>
        <motion.div initial={reduced?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.3}} className="mt-7 max-w-120"><p className="text-sm leading-[1.75] text-white/70 lg:text-base">Je donne une structure aux idées, puis je construis les interfaces, les services et les données qui les font fonctionner.</p><Button variant="light" className="mt-7 gap-6 text-xs" onClick={()=>go('projets')}>Découvrir mon travail <span className="grid size-6 place-items-center rounded-full bg-accent text-white"><ArrowUpRight size={14}/></span></Button></motion.div>
        <dl className="mt-8 flex items-center gap-x-3 text-[clamp(.65rem,.9vw,.8rem)] text-white/65 sm:gap-x-5 lg:mt-10 lg:gap-x-7">
          {[['Web & mobile','Des parcours pensés pour leurs utilisateurs.'],['Architecture','Des composants qui communiquent clairement.'],['Données','Des règles métier traduites dans le modèle.'],['IA appliquée','Des intégrations au service d’un besoin précis.']].map(([name,desc])=><div key={name} className="shrink-0"><dt>{name}</dt><dd className="sr-only">{desc}</dd></div>)}
        </dl>
      </div>
      <motion.div initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:.15}} className="relative -mx-6 mt-6 h-84 sm:-mx-10 sm:h-104 md:mx-0 md:mt-0 md:h-auto">
        <motion.img src="/images/portrait-hq-transparent.webp" alt="Portrait de Pape Souleymane Seck, avec les épaules et le buste visibles" style={reduced ? {} : {y:imageY}} fetchPriority="high" decoding="async" width="1183" height="1329" className="absolute bottom-0 left-1/2 h-full w-full max-w-none -translate-x-1/2 object-contain object-bottom md:h-[94%] md:w-[116%]" />
      </motion.div>
    </div>
  </section>
}

function Miniature({ project }) {
  return <div className="relative flex h-full items-center justify-center overflow-hidden px-6">
    <div className="w-full rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_12px_35px_#00000008]">
      <div className="mb-4 flex gap-1.5"><span className="size-1.5 rounded-full bg-neutral-300"/><span className="size-1.5 rounded-full bg-neutral-300"/><span className="size-1.5 rounded-full bg-neutral-300"/></div>
      {(project.id==='jokko' ? ['Message envoyé','Accusé serveur','Reprise après reconnexion'] : ['Brief client','Questions de cadrage','Dossier de conception']).map((item,i)=><div key={item} className={cn('mb-2 flex items-center gap-2 rounded-lg p-2.5 text-[10px]',i===1?'ml-5 bg-neutral-900 text-white':'mr-5 bg-white text-neutral-600')}><span className="size-1 rounded-full bg-current opacity-50"/>{item}</div>)}
    </div>
  </div>
}

function ProjectCarousel({ go }) {
  const [viewport, api] = useEmblaCarousel({align:'start',dragFree:true,containScroll:'trimSnaps'})
  const [canPrev,setCanPrev] = useState(false), [canNext,setCanNext] = useState(true)
  const onSelect = useCallback(()=>{if(api){setCanPrev(api.canScrollPrev());setCanNext(api.canScrollNext())}},[api])
  useEffect(()=>{if(!api)return;onSelect();api.on('select',onSelect);api.on('reInit',onSelect);return()=>{api.off('select',onSelect);api.off('reInit',onSelect)}},[api,onSelect])
  return <section id="projets" className="py-18 sm:py-24">
    <div className="px-6 sm:px-10 lg:px-16"><SectionHeading label="Projets choisis" title={<>Des outils pour l’école,<br className="hidden sm:block"/> l’immobilier et la sécurité.</>}><p>Des domaines différents, une même attention aux parcours et aux données.</p><div className="mt-5 flex gap-2"><Button variant="default" size="icon" disabled={!canPrev} onClick={()=>api?.scrollPrev()} aria-label="Projets précédents"><ArrowLeft size={17}/></Button><Button variant="default" size="icon" disabled={!canNext} onClick={()=>api?.scrollNext()} aria-label="Projets suivants"><ArrowRight size={17}/></Button></div></SectionHeading></div>
    <div ref={viewport} className="overflow-hidden px-6 sm:px-10 lg:px-16"><div className="flex touch-pan-y gap-4">
      {cases.map(project=>{const theme=colors[project.id];return <motion.a key={project.id} href={`#${project.id}`} whileHover={{y:-5}} transition={{duration:.3}} className={cn('group block min-w-0 flex-[0_0_83%] overflow-hidden rounded-[24px] focus-visible:outline-2 focus-visible:outline-accent sm:flex-[0_0_43%] lg:flex-[0_0_28%] xl:flex-[0_0_25.5%]',theme.card)}>
        <div className="min-h-51 p-6"><div className="mb-5 flex gap-1.5"><span className="rounded-md bg-white/75 px-2 py-1 text-[9px]">{theme.type}</span><span className="rounded-md bg-white/75 px-2 py-1 text-[9px]">{theme.year}</span></div><h3 className="mb-3 text-3xl leading-none font-bold tracking-[-.05em]">{project.title}</h3><p className="max-w-55 text-xs leading-relaxed text-neutral-700">{theme.short}</p></div>
        <div className="relative h-53 overflow-hidden rounded-t-[22px]">{theme.image?<img src={theme.image} alt={project.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>:<Miniature project={project}/>}<span className="absolute bottom-4 left-4 inline-flex items-center gap-3 rounded-full bg-white/95 py-2 pr-2 pl-4 text-[10px] shadow-sm">Voir l’étude de cas <span className="grid size-6 place-items-center rounded-full bg-white text-black"><ArrowUpRight size={15}/></span></span></div>
      </motion.a>})}
    </div></div>
    <p className="mt-5 px-6 text-[11px] text-neutral-400 sm:px-10 lg:px-16">Faites glisser les projets ou utilisez les flèches. Les études de cas se trouvent juste en dessous.</p>
  </section>
}

function FlowSequence({ steps }) {
  const [active,setActive] = useState(0), [playing,setPlaying] = useState(false)
  const reduced = useReducedMotion()
  useEffect(()=>{if(!playing||reduced)return;const timer=setInterval(()=>setActive(x=>(x+1)%steps.length),2600);return()=>clearInterval(timer)},[playing,reduced,steps.length])
  return <div className="rounded-3xl bg-[#f4f4ef] p-5 sm:p-7">
    <div className="mb-7 flex items-center justify-between"><h4 className="text-sm font-medium">Le parcours, étape par étape</h4><Button size="sm" variant="outline" onClick={()=>setPlaying(!playing)} aria-label={playing?'Mettre en pause le parcours':'Animer le parcours'}>{playing?<Pause size={13}/>:<Play size={13}/>}<span className="hidden sm:inline">{playing?'Pause':'Lire le flux'}</span></Button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step,index)=><button key={step} onClick={()=>{setActive(index);setPlaying(false)}} className="relative text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"><div className="relative mb-4 h-0.5 bg-neutral-200">{active===index&&<motion.div layoutId={undefined} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:playing?2.6:.35,ease:'linear'}} className="absolute inset-0 origin-left bg-accent"/>}</div><span className={cn('mb-3 inline-grid size-7 place-items-center rounded-full text-[10px] transition-colors',active===index?'bg-neutral-900 text-white':'bg-white text-neutral-400')}>{index+1}</span><p className={cn('text-xs leading-relaxed transition-colors',active===index?'text-neutral-900':'text-neutral-500')}>{step}</p></button>)}</div>
  </div>
}

function ProjectStudy({ project, index }) {
  const theme=colors[project.id]
  return <article id={project.id} className="scroll-mt-24 border-t border-neutral-100 py-16 sm:py-20">
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><div className="mb-4 flex flex-wrap gap-2"><span className={cn('rounded-md px-2.5 py-1 text-[10px] font-medium',theme.card)}>{theme.type}</span><span className="rounded-md bg-neutral-100 px-2.5 py-1 text-[10px] text-neutral-500">{project.status}</span></div><h3 className="text-[clamp(2.5rem,5vw,5rem)] leading-none font-bold tracking-[-.055em]">{project.title}</h3></div><p className="max-w-110 text-base leading-snug tracking-[-.02em] text-neutral-500 sm:text-xl">{project.lead}</p></div>
    <div className="grid items-start gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-12">
      <div className="pt-1"><div className="mb-7"><h4 className="mb-2.5 text-sm font-medium">Le besoin</h4><p className="text-sm leading-relaxed text-neutral-500">{project.challenge}</p></div><div className="mb-7"><h4 className="mb-2.5 text-sm font-medium">Réalisation de bout en bout</h4><p className="text-sm leading-relaxed text-neutral-500">{project.solution}</p></div><div className={cn('rounded-2xl p-5',theme.soft)}><p className={cn('mb-2 text-xs font-medium',theme.text)}>Un choix de conception</p><p className="text-xs leading-relaxed text-neutral-600">{project.decision}</p></div><div className="mt-6 flex flex-wrap gap-1.5">{project.stack.map(item=><span key={item} className="rounded-full border border-neutral-200 px-2.5 py-1.5 text-[10px] text-neutral-500">{item}</span>)}</div><p className="mt-5 text-[11px] leading-relaxed text-neutral-400">{project.role}</p></div>
      <ProjectDiagrams project={project}/>
    </div>
    <ProjectDepth project={project} deep={project.deep}/>
    <div className="mt-8"><FlowSequence steps={project.flows}/></div>
  </article>
}

function OtherProjects() {
  const [query,setQuery]=useState('')
  const items=extraCases.filter(item=>(item.title+' '+item.category+' '+item.stack.join(' ')).toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')))
  return <section className="bg-[#f6f6f2] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
    <SectionHeading label="Autres réalisations" title="Explorer le reste du parcours."><p>Produits clients, prototypes et travaux de recherche. Un clic suffit pour ouvrir le contexte et le schéma.</p></SectionHeading>
    <div className="mb-7 flex max-w-sm items-center gap-2 rounded-full border border-neutral-200 bg-white px-4"><MagnifyingGlass size={17} className="text-neutral-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Un projet, un domaine, une technologie…" aria-label="Rechercher un projet" className="h-11 w-full bg-transparent text-xs outline-none placeholder:text-neutral-400"/>{query&&<button onClick={()=>setQuery('')} aria-label="Effacer la recherche"><X size={14}/></button>}</div>
    <Accordion type="multiple">{items.map(project=><AccordionItem value={project.id} key={project.id} className="border-neutral-200"><AccordionTrigger><div className="grid flex-1 gap-2 sm:grid-cols-[.65fr_1fr] sm:items-center sm:gap-6"><span><span className="block text-xl font-bold tracking-[-.035em]">{project.title}</span><span className="mt-1 block text-[10px] font-normal text-neutral-400">{project.category}</span></span><p className="max-w-lg text-xs leading-relaxed font-normal text-neutral-500">{project.lead}</p></div></AccordionTrigger><AccordionContent className="rounded-3xl bg-white px-5 pt-6 sm:px-8"><div className="grid gap-8 lg:grid-cols-2"><div><h4 className="mb-2 text-sm font-medium">Le besoin</h4><p className="mb-5 text-sm leading-relaxed text-neutral-500">{project.challenge}</p><h4 className="mb-2 text-sm font-medium">La réponse</h4><p className="text-sm leading-relaxed text-neutral-500">{project.solution}</p><div className="mt-5 flex flex-wrap gap-1.5">{project.stack.map(item=><span key={item} className="rounded-full bg-neutral-100 px-2.5 py-1.5 text-[10px] text-neutral-500">{item}</span>)}</div></div><ProjectDiagrams project={project}/></div><ProjectDepth project={project} deep={project.deep}/><div className="mt-8"><FlowSequence steps={project.flows}/></div></AccordionContent></AccordionItem>)}</Accordion>
    {items.length===0&&<p className="py-8 text-sm text-neutral-500">Aucun projet ne correspond à cette recherche.</p>}
  </section>
}

export default function Portfolio() {
  const [menu,setMenu]=useState(false)
  const reduced=useReducedMotion(), {scrollYProgress}=useScroll()
  const go=id=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:reduced?'auto':'smooth'})}
  return <div className="w-full bg-white">
    <motion.div style={{scaleX:scrollYProgress}} className="fixed top-0 right-0 left-0 z-60 h-0.5 origin-left bg-accent"/>
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-neutral-100 bg-white px-6 sm:px-10 lg:px-14">
      <a href="#accueil" className="flex items-center gap-2.5" aria-label="Accueil de Pape Souleymane Seck"><span className="grid size-8 place-items-center rounded-full bg-lime"><AsteriskSimple size={21} weight="bold"/></span><span className="text-sm font-bold tracking-[-.04em]">Souleymane Seck<span className="text-accent">.</span></span></a>
      <nav className="hidden items-center gap-1 rounded-full bg-neutral-100 p-1 md:flex" aria-label="Navigation principale"><button onClick={()=>go('accueil')} className="rounded-full bg-white px-4 py-2 text-[11px] shadow-sm">Accueil</button><button onClick={()=>go('projets')} className="rounded-full px-4 py-2 text-[11px] text-neutral-500 hover:text-black">Projets</button><button onClick={()=>go('parcours')} className="rounded-full px-4 py-2 text-[11px] text-neutral-500 hover:text-black">Parcours</button></nav>
      <div className="flex items-center gap-2"><Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><a href="#contact">Discutons <span className="grid size-5 place-items-center rounded-full bg-accent text-white"><ArrowUpRight size={12}/></span></a></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label={menu?'Fermer le menu':'Ouvrir le menu'}>{menu?<X size={20}/>:<List size={20}/>}</Button></div>
      {menu&&<nav className="absolute top-20 right-4 left-4 flex flex-col gap-1 rounded-2xl border border-neutral-100 bg-white p-3 shadow-xl md:hidden" aria-label="Navigation mobile">{[['accueil','Accueil'],['projets','Projets'],['parcours','Parcours'],['contact','Contact']].map(([id,name])=><button key={id} onClick={()=>go(id)} className="rounded-xl px-4 py-3 text-left text-sm hover:bg-neutral-100">{name}</button>)}</nav>}
    </header>
    <main><Hero go={go}/>
      <ProjectBrands/>
      <ProjectCarousel go={go}/>
      <section className="px-6 pb-8 sm:px-10 lg:px-16"><SectionHeading label="Au-delà des écrans" title={<>Comprendre un projet<br/>jusqu’à ses données.</>}><p>Voici les choix, les flux et les relations derrière chaque application. Les informations essentielles sont directement visibles dans la page.</p></SectionHeading>{cases.map((project,index)=><ProjectStudy key={project.id} project={project} index={index}/>)}</section>
      <OtherProjects/><AboutSection/>
      <ProjectRequestForm/>
    </main>
    <footer className="flex items-center justify-between gap-4 px-7 py-5 text-[10px] text-neutral-400 sm:px-12"><span>© {new Date().getFullYear()} Pape Souleymane Seck</span><button onClick={()=>go('accueil')} className="flex items-center gap-2 hover:text-black">Retour en haut <ArrowUpRight size={13}/></button></footer>
  </div>
}

