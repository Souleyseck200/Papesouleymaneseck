import { motion, useReducedMotion } from 'framer-motion'
import { Monitor, Database, Check } from '@phosphor-icons/react'
import sourceMetrics from '../content/source-metrics.json'

function Layer({ title, icon: Icon, items }) {
  const reduced=useReducedMotion()
  return <div><h4 className="mb-6 flex items-center gap-2.5 text-lg font-bold tracking-tight"><span className="grid size-10 place-items-center rounded-xl bg-neutral-100"><Icon size={19} weight="light"/></span>{title}</h4><div className="space-y-6">{items.map(([name,description],index)=><motion.div key={name} initial={reduced?false:{opacity:.3,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.55,delay:index*.04}}><h5 className="mb-2 text-sm font-medium">{name}</h5><p className="text-sm leading-[1.8] text-neutral-500">{description}</p></motion.div>)}</div></div>
}

export function ProjectDepth({ project, deep }) {
  if(!deep)return null
  const metrics=sourceMetrics[project.id]
  return <div className="mt-12 space-y-12 border-t border-neutral-100 pt-10">
    <div className="max-w-4xl"><p className="mb-3 text-xs font-medium text-accent">Le produit et son usage</p><p className="text-xl leading-relaxed tracking-[-.02em] text-neutral-700 sm:text-2xl">{deep.purpose}</p></div>
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><Layer title="Interfaces et expérience utilisateur" icon={Monitor} items={deep.front}/><Layer title="Services et règles métier" icon={Database} items={deep.back}/></div>
    {metrics?.pages>0&&<div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-neutral-200 px-6 py-4"><p className="text-xs font-medium">Étendue de l’interface dans le code</p><p className="text-xs text-neutral-500"><strong className="text-neutral-900">{metrics.pages}</strong> fichiers de pages, vues ou routes UI identifiés{metrics.mobile>0&&<> · dont {metrics.mobile} routes mobiles</>}</p>{project.id==='edukora'&&<p className="text-xs text-neutral-500">{metrics.routeFiles} fichiers de routes API</p>}<span className="text-[10px] text-neutral-400">Inventaire statique; ces fichiers ne sont pas un décompte d’écrans testés.</span></div>}
    <div className="grid gap-6 rounded-3xl bg-neutral-50 p-6 sm:p-8 lg:grid-cols-[.65fr_1.35fr]"><div><h4 className="mb-3 text-lg font-bold tracking-tight">Les méthodes mises en œuvre</h4><p className="text-xs leading-relaxed text-neutral-400">Des choix qui relient l’interface aux contraintes du domaine.</p></div><ul className="grid gap-3 sm:grid-cols-2">{deep.methods.map(item=><li key={item} className="flex gap-2.5 text-xs leading-relaxed text-neutral-600"><Check size={14} className="mt-0.5 shrink-0 text-neutral-400"/>{item}</li>)}</ul></div>
    <div className="rounded-2xl border border-neutral-200 p-6"><h4 className="mb-3 text-sm font-medium">Cycle de vie des données</h4><p className="max-w-5xl text-sm leading-[1.8] text-neutral-500">{deep.lifecycle}</p></div>
  </div>
}
