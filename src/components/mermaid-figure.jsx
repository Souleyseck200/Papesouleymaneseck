import { useEffect, useId, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const config = {
  startOnLoad: false, securityLevel: 'strict', theme: 'base',
  themeVariables: {
    primaryColor: '#f3f5f8', primaryTextColor: '#182539', primaryBorderColor: '#c2cbd7',
    lineColor: '#8794a5', secondaryColor: '#fff1e6', tertiaryColor: '#ffffff',
    clusterBkg: '#f8fafc', clusterBorder: '#dce2e9',
    fontFamily: 'Roboto, Arial, sans-serif', fontSize: '14px',
  },
  flowchart: { curve: 'basis', nodeSpacing: 32, rankSpacing: 45, htmlLabels: true },
}
const cache = new Map()
let nextId = 0
let engine

function renderDiagram(chart) {
  if (!cache.has(chart)) {
    engine ??= import('mermaid').then(({ default: mermaid }) => { mermaid.initialize(config); return mermaid })
    const pending = engine.then(async mermaid => {
      await document.fonts.ready
      // Measure diagrams outside animated cards and mobile-width containers.
      const host = document.createElement('div')
      host.className = 'diagram-render-host'
      host.setAttribute('aria-hidden', 'true')
      Object.assign(host.style, { position: 'fixed', left: '-100000px', top: '0', width: '1600px', visibility: 'hidden', pointerEvents: 'none' })
      document.body.append(host)
      const renderId = `portfolio-diagram-${++nextId}`
      try { return { ...await mermaid.render(renderId, chart, host), renderId } }
      finally { host.remove() }
    }).then(({ svg, renderId }) => {
      const element = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
      const [, , width, height] = (element.getAttribute('viewBox') || '0 0 800 600').split(/\s+/).map(Number)
      return { svg, renderId, width: width || 800, height: height || 600 }
    })
    cache.set(chart, pending)
    pending.catch(() => cache.delete(chart))
  }
  return cache.get(chart)
}

export function useDiagram(chart, enabled = true) {
  const instance = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!enabled || !chart) return
    let active = true
    setError(false)
    setResult(null)
    renderDiagram(chart).then(value => { if (active) setResult({ ...value, svg: value.svg.replaceAll(value.renderId, `diagram-${instance}`) }) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [chart, enabled])
  return { result, error }
}

export function MermaidPreview({ chart }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '150px' })
  const { result, error } = useDiagram(chart, visible)
  return <div ref={ref} aria-hidden="true" className="diagram-preview flex h-full w-full items-center justify-center overflow-hidden p-4">
    {result ? <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: result.svg }} /> :
      <span className="text-[11px] text-slate-400">{error ? 'Ouvrir les détails' : 'Préparation de l’aperçu…'}</span>}
  </div>
}
