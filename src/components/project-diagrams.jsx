import { useEffect, useId, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { ArrowUpRight, ArrowsOut, ArrowsLeftRight, Database, TreeStructure, Plus, Minus, X, Info, CaretDown } from '@phosphor-icons/react'
import { MermaidPreview, useDiagram } from './mermaid-figure'
import { models, logicalModels } from '../models'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

function diagramsFor(project) {
  const deep = project.deep
  return [
    (deep?.architecture || project.diagram) && {
      id: 'architecture', title: 'Architecture', icon: TreeStructure,
      subtitle: 'Interfaces, services et connexions',
      chart: deep?.architecture || project.diagram,
      introduction: deep?.purpose || project.lead,
    },
    (models[project.id] || logicalModels[project.id]) && {
      id: 'data', title: 'Modèle de données', icon: Database,
      subtitle: 'Entités, relations et tables', chart: models[project.id],
      introduction: deep?.lifecycle || project.decision,
    },
    deep?.sequence && {
      id: 'sequence', title: 'Flux de bout en bout', icon: ArrowsLeftRight,
      subtitle: 'Une action à travers le système', chart: deep.sequence,
      introduction: 'Suivez les échanges dans leur ordre d’exécution, depuis l’interface jusqu’aux services et aux données.',
    },
  ].filter(Boolean)
}

function TableList({ project }) {
  return <div className="space-y-4">{(logicalModels[project.id] || []).map(([name, description]) => <div key={name} className="border-b border-slate-200 pb-4 last:border-0">
    <h5 className="mb-1.5 break-words text-xs font-medium text-slate-800">{name}</h5>
    <p className="text-xs leading-relaxed text-slate-500">{description}</p>
  </div>)}</div>
}

function ReadingGuide({ project, diagram }) {
  const deep = project.deep
  return <>
    <p className="mb-6 text-sm leading-[1.7] text-slate-600">{diagram.introduction}</p>
    {diagram.id === 'architecture' && <div className="space-y-6">{[
      ['Côté interface', deep?.front], ['Côté services', deep?.back],
    ].filter(([, items]) => items?.length).map(([name, items]) => <section key={name}>
      <h4 className="mb-3 text-xs font-medium text-slate-900">{name}</h4>
      <div className="space-y-4">{items.map(([title, description]) => <div key={title}><h5 className="mb-1 text-xs font-medium text-slate-700">{title}</h5><p className="text-xs leading-relaxed text-slate-500">{description}</p></div>)}</div>
    </section>)}</div>}
    {diagram.id === 'data' && <TableList project={project} />}
    {diagram.id === 'sequence' && <ol className="space-y-4">{project.flows.map((step, index) => <li key={step} className="flex gap-3 text-xs leading-relaxed text-slate-600"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] text-slate-500">{index + 1}</span>{step}</li>)}</ol>}
  </>
}

function DiagramCanvas({ chart, title }) {
  const { result, error } = useDiagram(chart)
  const host = useRef(null), transform = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const reduced = useReducedMotion()
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    if (host.current) observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  const fit = (duration = 300) => {
    if (!result || !size.width || !size.height) return
    const target = Math.min((size.width - 48) / result.width, (size.height - 64) / result.height, 1)
    transform.current?.setTransform((size.width - result.width * target) / 2, (size.height - result.height * target) / 2, target, reduced ? 0 : duration, 'easeOut')
  }
  useEffect(() => { const frame = requestAnimationFrame(() => fit(0)); return () => cancelAnimationFrame(frame) }, [result, size.width, size.height])
  return <div ref={host} className="relative h-full min-h-72 overflow-hidden bg-[#f7f9fc] [background-image:radial-gradient(#d4dce7_1px,transparent_1px)] [background-size:20px_20px]" aria-label={title}>
    {result ? <TransformWrapper ref={transform} minScale={0.05} maxScale={4} limitToBounds={false} wheel={{ step: 0.12 }} doubleClick={{ mode: 'zoomIn', step: 0.6 }} onTransform={(_, state) => setScale(state.scale)}>
      {({ zoomIn, zoomOut }) => <>
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: result.width, height: result.height }}>
          <div className="diagram-canvas cursor-grab active:cursor-grabbing" style={{ width: result.width, height: result.height }} role="img" aria-label={title} dangerouslySetInnerHTML={{ __html: result.svg }} />
        </TransformComponent>
        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <Button size="icon" variant="ghost" className="size-9" aria-label="Réduire le diagramme" onClick={() => zoomOut(0.3, reduced ? 0 : 200)}><Minus size={16}/></Button>
          <span className="w-11 text-center text-[11px] tabular-nums text-slate-500" aria-live="polite">{Math.round(scale * 100)} %</span>
          <Button size="icon" variant="ghost" className="size-9" aria-label="Agrandir le diagramme" onClick={() => zoomIn(0.3, reduced ? 0 : 200)}><Plus size={16}/></Button>
          <span className="mx-1 h-4 w-px bg-slate-200"/>
          <Button size="icon" variant="ghost" className="size-9" aria-label="Ajuster le diagramme à l’écran" onClick={() => fit()}><ArrowsOut size={17}/></Button>
        </div>
        <p className="pointer-events-none absolute right-5 bottom-7 hidden text-[11px] text-slate-400 xl:block">Glissez pour déplacer · Défilez pour zoomer</p>
      </>}
    </TransformWrapper> : <div className="grid h-full place-items-center px-8 text-center text-sm text-slate-500">{error ? 'Le schéma n’a pas pu être affiché. Les explications restent disponibles à côté.' : 'Ouverture du diagramme…'}</div>}
  </div>
}

export function ProjectDiagrams({ project }) {
  const diagrams = diagramsFor(project)
  const instance = useId(), trigger = useRef(null)
  const [open, setOpen] = useState(false), [active, setActive] = useState(0), [sourceCard, setSourceCard] = useState('architecture'), [showGuide, setShowGuide] = useState(false)
  const reduced = useReducedMotion()
  const current = diagrams[active]
  if (!diagrams.length) return null
  const transition = reduced ? { duration: 0 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
  return <LayoutGroup id={instance}>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="project-diagrams">
        <div className="mb-4 flex items-center justify-between gap-3"><h4 className="text-sm font-medium">Explorer le système</h4><span className="text-[11px] text-neutral-400">Ouvrir un schéma</span></div>
        <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
          {diagrams.map((diagram, index) => <Dialog.Trigger key={diagram.id} asChild>
            <motion.button layoutId={reduced ? undefined : `${instance}-${diagram.id}`} transition={transition} onClick={event => { trigger.current = event.currentTarget; setActive(index); setSourceCard(diagram.id); setShowGuide(false) }} aria-label={`Ouvrir ${diagram.title} de ${project.title}`} className={cn('group overflow-hidden rounded-[20px] border border-slate-200 bg-white text-left outline-none transition-colors hover:border-slate-400 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4', index === 0 && diagrams.length > 1 && 'min-[440px]:col-span-2')}>
              <div className={cn('pointer-events-none relative h-28 overflow-hidden bg-[#f5f7fa]', index === 0 && 'h-40')}>
                {diagram.chart ? <MermaidPreview chart={diagram.chart} /> : <div className="space-y-2 px-6 pt-5">{logicalModels[project.id]?.slice(0, 3).map(([name]) => <div key={name} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">{name}</div>)}</div>}
                <span className="absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-white text-slate-500 transition-colors group-hover:bg-navy group-hover:text-white"><ArrowsOut size={14}/></span>
              </div>
              <div className="relative flex items-center gap-3 px-4 py-4"><diagram.icon size={19} weight="light" className="shrink-0 text-slate-400"/><div className="min-w-0"><h5 className="text-sm font-medium">{diagram.title}</h5><p className="mt-1 text-[11px] text-slate-500">{diagram.subtitle}</p></div><ArrowUpRight size={17} className="ml-auto shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></div>
            </motion.button>
          </Dialog.Trigger>)}
        </div>
      </div>
      <AnimatePresence>
        {open && <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} className="fixed inset-0 z-70 bg-navy/65" /></Dialog.Overlay>
          <Dialog.Content forceMount asChild onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }) }}>
            <motion.section layoutId={reduced ? undefined : `${instance}-${sourceCard}`} transition={transition} className="fixed inset-0 z-80 m-auto flex h-dvh w-full flex-col overflow-hidden bg-white outline-none sm:inset-5 sm:h-[calc(100dvh_-_40px)] sm:w-[calc(100%_-_40px)] sm:rounded-[24px] lg:max-h-240 lg:max-w-420">
              <motion.div layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.22, delay: reduced ? 0 : 0.12 }} className="flex min-h-0 flex-1 flex-col">
                <header className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
                  <div><p className="mb-1.5 text-xs text-slate-500">{project.title}</p><Dialog.Title className="text-xl font-bold tracking-tight sm:text-2xl">{current.title}</Dialog.Title><Dialog.Description className="sr-only">{current.subtitle}. Diagramme déplaçable et zoomable, accompagné d’explications.</Dialog.Description></div>
                  <Dialog.Close asChild><Button variant="outline" size="icon" className="size-10 shrink-0" aria-label="Fermer le diagramme"><X size={18}/></Button></Dialog.Close>
                </header>
                <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:px-6" aria-label="Vues du projet">
                  {diagrams.map((diagram, index) => <button key={diagram.id} onClick={() => { setActive(index); setShowGuide(false) }} aria-current={index === active ? 'page' : undefined} className={cn('relative flex shrink-0 items-center gap-2 px-3 pt-2 pb-4 text-xs outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent', index === active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700')}><diagram.icon size={16}/>{diagram.title}{index === active && <motion.span layoutId={`${instance}-tab`} transition={transition} className="absolute right-3 bottom-0 left-3 h-0.5 rounded-full bg-accent"/>}</button>)}
                </nav>
                <div className="relative grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-1 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <AnimatePresence mode="wait" initial={false}><motion.div key={current.id} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0 : 0.2 }} className="min-h-0 min-w-0">
                    {current.chart ? <DiagramCanvas chart={current.chart} title={`${current.title} de ${project.title}`} /> : <div className="h-full overflow-y-auto bg-slate-50 p-6 sm:p-10"><TableList project={project}/></div>}
                  </motion.div></AnimatePresence>
                  <aside className={cn('min-h-0 border-t border-slate-200 bg-white lg:flex lg:flex-col lg:border-t-0 lg:border-l', showGuide && 'absolute inset-0 z-10 lg:relative')}>
                    <h3 className="hidden items-center gap-2 px-6 pt-6 pb-4 text-xs font-medium lg:flex"><Info size={17} className="text-slate-400"/>Comprendre ce schéma</h3>
                    <button className="flex w-full items-center justify-between px-5 py-4 text-xs font-medium lg:hidden" onClick={() => setShowGuide(value => !value)} aria-expanded={showGuide} aria-controls={`${instance}-guide`}><span className="flex items-center gap-2"><Info size={17} className="text-slate-400"/>Comprendre ce schéma</span><CaretDown size={15} className={cn('transition-transform', showGuide && 'rotate-180')}/></button>
                    <div id={`${instance}-guide`} className={cn('min-h-0 overflow-y-auto px-5 pb-6 lg:block lg:flex-1 lg:px-6', showGuide ? 'block h-[calc(100%-50px)]' : 'hidden')}><ReadingGuide project={project} diagram={current}/></div>
                  </aside>
                </div>
              </motion.div>
            </motion.section>
          </Dialog.Content>
        </Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  </LayoutGroup>
}
