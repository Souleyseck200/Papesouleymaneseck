import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BracketsCurly, CaretDown,
  Check, CirclesThreePlus, Database, TreeStructure, EnvelopeSimple,
  GithubLogo, Globe, List, MapPin, Minus, Plus, X,
} from '@phosphor-icons/react'
import { cases } from './data'
import { extraCases } from './extended'
import { logicalModels, models } from './models'

const diagramOptions = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  themeVariables: {
    primaryColor: '#e6eae3',
    primaryTextColor: '#183d31',
    primaryBorderColor: '#b9c8bb',
    lineColor: '#658579',
    secondaryColor: '#f6f5f0',
    tertiaryColor: '#edf0e9',
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  flowchart: { curve: 'basis', htmlLabels: true, nodeSpacing: 38, rankSpacing: 60 },
}

const spring = { type: 'spring', stiffness: 190, damping: 27 }

function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function DiagramView({ chart, projectId }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    setSvg('')
    setError(false)
    const id = `diagram-${projectId}-${Math.random().toString(36).slice(2, 9)}`
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize(diagramOptions)
      return mermaid.render(id, chart)
    }).then(({ svg: result }) => {
      if (active) setSvg(result)
    }).catch(() => {
      if (active) setError(true)
    })
    return () => { active = false }
  }, [chart, projectId])
  return (
    <div className="diagram-canvas" aria-label="Schéma interactif de l’architecture">
      {svg ? <div className="mermaid-output" dangerouslySetInnerHTML={{ __html: svg }} /> : error ? <p>Le schéma n’a pas pu être affiché.</p> : <p>Chargement du schéma…</p>}
    </div>
  )
}

function CaseDialog({ project, onClose }) {
  const [tab, setTab] = useState('vue')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const closeRef = useRef(null)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStep(current => (current + 1) % project.flows.length), 2200)
    return () => window.clearInterval(timer)
  }, [playing, project])
  useEffect(() => {
    setTab('vue')
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])
  const tabs = [
    ['vue', 'Vue d’ensemble'],
    ['architecture', 'Architecture'],
    ['modele', 'Modèle de données'],
    ['flux', 'Flux & données'],
  ]
  return (
    <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.section className="case-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" initial={{ y: 46, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} transition={spring}>
        <div className="dialog-topbar">
          <span className="eyebrow">Étude de cas / {project.number}</span>
          <button className="icon-button close-button" ref={closeRef} onClick={onClose} aria-label="Fermer l’étude de cas"><X size={20} weight="light" /></button>
        </div>
        <div className="dialog-scroll">
          <div className="dialog-intro">
            <div>
              <p className="eyebrow">{project.category}</p>
              <h2 id="dialog-title">{project.title}</h2>
              <p className="dialog-lead">{project.lead}</p>
            </div>
            <div className="dialog-meta"><span>Rôle</span><strong>{project.role}</strong><span>État</span><strong>{project.status}</strong></div>
          </div>
          <div className="dialog-tabs" role="tablist" aria-label="Explorer le projet">
            {tabs.map(([key, name]) => <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={tab === key ? 'active' : ''}>{name}</button>)}
          </div>
          {tab === 'vue' && <motion.div key="vue" className="dialog-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {project.image && <div className="dialog-image"><img src={project.image} alt={project.imageAlt} /><span>Illustration éditoriale du domaine</span></div>}
            <div className="story-grid">
              <article><span className="section-index">01 / Le problème</span><h3>Comprendre le besoin</h3><p>{project.challenge}</p></article>
              <article><span className="section-index">02 / La réponse</span><h3>Structurer la solution</h3><p>{project.solution}</p></article>
              <article><span className="section-index">03 / Le choix</span><h3>Décision technique</h3><p>{project.decision}</p></article>
            </div>
            <div className="boundary"><span>Périmètre présenté</span><p>{project.status}. Les schémas décrivent le fonctionnement étudié et les parcours associés.</p></div>
          </motion.div>}
          {tab === 'architecture' && <motion.div key="architecture" className="dialog-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="diagram-heading"><div><span className="section-index">Architecture / vue simplifiée</span><h3>Comment les éléments communiquent</h3></div><TreeStructure size={30} weight="light" /></div>
            <DiagramView chart={project.diagram} projectId={project.id} />
            <p className="diagram-caption">Schéma de lecture simplifié d’après les modules étudiés. Les détails internes sont volontairement regroupés pour rendre le fonctionnement lisible.</p>
            <div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </motion.div>}
          {tab === 'modele' && <motion.div key="modele" className="dialog-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="diagram-heading"><div><span className="section-index">Modélisation / relations</span><h3>Les données qui structurent le projet</h3></div><Database size={30} weight="light" /></div>
            {models[project.id] ? <><DiagramView chart={models[project.id]} projectId={project.id + '-model'} /><p className="diagram-caption">Modèle conceptuel simplifié à partir des migrations et relations examinées. Les noms et cardinalités doivent être rapprochés du schéma final avant toute publication technique détaillée.</p></> : <div className="model-note"><TreeStructure size={32} weight="light" /><p>Les objets métier identifiés sont présentés ci-dessous. Un modèle relationnel complet demande une vérification complémentaire du schéma final.</p></div>}
            {logicalModels[project.id] && <div className="logical-model"><span className="section-index">Modèle logique / tables étudiées</span>{logicalModels[project.id].map(([name, description]) => <div key={name}><code>{name}</code><p>{description}</p></div>)}</div>}
            <div className="data-block"><span className="section-index">Objets et tables identifiés</span><div>{project.data.map(item => <span key={item}>{item}</span>)}</div></div>
          </motion.div>}
          {tab === 'flux' && <motion.div key="flux" className="dialog-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="diagram-heading"><div><span className="section-index">Parcours / données</span><h3>Suivre une opération de bout en bout</h3></div><Database size={30} weight="light" /></div>
            <div className="flow-player"><div className="flow-player-head"><span className="section-index">Simulation du parcours</span><button onClick={() => setPlaying(!playing)}>{playing ? 'Mettre en pause' : 'Animer le flux'} <ArrowRight size={14} /></button></div><div className={playing ? 'flow-orbit playing' : 'flow-orbit'}>{project.flows.map((item, index) => <button key={item} onClick={() => { setStep(index); setPlaying(false) }} className={step === index ? 'flow-node active' : 'flow-node'} aria-label={`Étape ${index + 1} : ${item}`}><span>{String(index+1).padStart(2,'0')}</span></button>)}</div><AnimatePresence mode="wait"><motion.p key={step} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>{project.flows[step]}</motion.p></AnimatePresence></div>
            <div className="flow-list">{project.flows.map((item, index) => <button className={step === index ? 'flow-step selected' : 'flow-step'} onClick={() => { setStep(index); setPlaying(false) }} key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><ArrowUpRight size={16} /></button>)}</div>
            <div className="data-block"><span className="section-index">Objets métier principaux</span><div>{project.data.map((item) => <span key={item}>{item}</span>)}</div></div>
          </motion.div>}
        </div>
      </motion.section>
    </motion.div>
  )
}

function App() {
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const reduced = useReducedMotion()
  const go = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
  }
  return (
    <>
      <div className="site-shell">
        <header className="site-header">
          <button className="brand" onClick={() => go('accueil')} aria-label="Retour en haut"><span className="brand-mark">PS.</span><span>Pape Souleymane Seck</span></button>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Navigation principale">
            <button onClick={() => go('projets')}>Projets</button>
            <button onClick={() => go('approche')}>Approche</button>
            <button onClick={() => go('parcours')}>Parcours</button>
            <button onClick={() => go('contact')}>Contact</button>
          </nav>
          <div className="header-actions"><span className="availability"><span /> Disponible pour échanger</span><button className="icon-button menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>{menuOpen ? <X size={19} /> : <List size={19} />}</button></div>
        </header>

        <main>
          <section className="hero" id="accueil">
            <div className="hero-media">
              <img src="/images/portrait.png" alt="Portrait de Pape Souleymane Seck" />
              <div className="hero-portrait-copy"><span>PORTFOLIO PERSONNEL / 2026</span><p>La vision.<br /><em>Le détail.</em><br />Le système.</p><small>Pape Souleymane Seck<br />Développeur full-stack</small></div>
              <div className="hero-media-label"><span>Développeur full-stack</span><span>Dakar · Sénégal</span></div>
            </div>
            <div className="hero-grid">
              <div className="hero-main">
                <Reveal><span className="eyebrow hero-kicker"><span className="small-plus"><Plus size={12} /></span> Portfolio / 2026</span></Reveal>
                <Reveal delay={0.08}><h1>Des idées complexes.<br /><em>Des produits clairs.</em></h1></Reveal>
                <Reveal delay={0.16}><p className="hero-description">Je conçois et développe des applications qui relient les besoins des utilisateurs, les règles métier et les données. Mon travail va du cadrage à l’interface, jusqu’aux flux qui font fonctionner le produit.</p></Reveal>
                <Reveal delay={0.22}><div className="hero-cta"><button className="pill-button dark" onClick={() => go('projets')}>Explorer mes projets <ArrowUpRight size={16} /></button><button className="text-link" onClick={() => go('approche')}>Ma façon de travailler <ArrowDownRight size={16} /></button></div></Reveal>
              </div>
              <aside className="hero-aside"><span className="section-index">01 / Ce que je fais</span><p>Architecture de produit, interfaces web et mobile, backend, modèles de données et intégrations IA.</p><div className="hero-counter"><strong>2020</strong><span>premiers projets<br />et apprentissage</span></div></aside>
            </div>
            <div className="hero-bottom"><span>Faire défiler pour découvrir</span><ArrowDownRight size={18} weight="light" /></div>
          </section>

          <section className="intro-section section-pad" id="approche">
            <Reveal className="section-heading-row"><span className="section-index">02 / Méthode</span><h2>Je pars du problème,<br />puis je construis le système.</h2></Reveal>
            <div className="method-grid">
              {[
                { icon: <CirclesThreePlus size={27} weight="light" />, n: '01', title: 'Comprendre', text: 'Identifier les acteurs, leurs besoins et les règles qui rendent le produit utile.' },
                { icon: <TreeStructure size={27} weight="light" />, n: '02', title: 'Structurer', text: 'Dessiner les parcours, les flux et les données avant de multiplier les écrans.' },
                { icon: <BracketsCurly size={27} weight="light" />, n: '03', title: 'Développer', text: 'Relier interface, API et base de données avec des contrats et des responsabilités clairs.' },
                { icon: <Check size={27} weight="light" />, n: '04', title: 'Faire évoluer', text: 'Observer le résultat, revoir les choix et adapter le produit aux besoins réels.' },
              ].map((item, i) => <Reveal key={item.n} delay={i * 0.07}><article className="method-card"><div className="method-top"><span>{item.n}</span>{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></article></Reveal>)}
            </div>
          </section>

          <section className="projects-section section-pad" id="projets">
            <Reveal className="section-heading-row project-heading"><span className="section-index">03 / Sélection</span><div><h2>Quelques projets,<br />vus de l’intérieur.</h2><p>Chaque étude de cas s’ouvre sur le problème, l’architecture et le parcours des données.</p></div></Reveal>
            <div className="case-grid">
              {cases.map((project, index) => <Reveal key={project.id} delay={(index % 2) * 0.08}><button className={project.image ? 'case-card with-image' : 'case-card typographic'} onClick={() => setSelected(project)} aria-label={`Explorer ${project.title}`}>
                <div className="case-visual">
                  {project.image ? <img src={project.image} alt={project.imageAlt} /> : <div className="type-visual"><span>{project.number} / Système</span><strong>{project.title}</strong><TreeStructure size={42} weight="thin" /></div>}
                  <span className="case-open"><ArrowUpRight size={19} /></span>
                </div>
                <div className="case-info"><span className="section-index">{project.number} / {project.category}</span><div><h3>{project.title}</h3><ArrowUpRight size={20} weight="light" /></div><p>{project.lead}</p></div>
              </button></Reveal>)}
            </div>
            <div className="more-projects">
              <div className="more-header"><span className="section-index">Autres explorations</span><button className="text-link" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>{showAll ? 'Réduire la liste' : 'Voir tous les projets'} {showAll ? <Minus size={16} /> : <Plus size={16} />}</button></div>
              <AnimatePresence>{showAll && <motion.div className="additional-grid" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }}>{extraCases.map((item) => <button className="additional-item" key={item.id} onClick={() => setSelected(item)}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.lead}</p></div><small>{item.stack.join(' · ')}</small><ArrowUpRight size={18} /></button>)}</motion.div>}</AnimatePresence>
            </div>
          </section>

          <section className="statement-section">
            <div className="statement-image"><img src="/images/maritime.png" alt="Vue éditoriale d’un navire sur l’Atlantique" /></div>
            <div className="statement-content"><span className="section-index">04 / Compétences</span><Reveal><h2>Du premier écran<br />à la dernière donnée.</h2></Reveal><p>J’interviens sur des produits qui demandent autant de clarté côté interface que de rigueur dans les règles et les échanges.</p><div className="skill-columns"><div><strong>Interfaces</strong><span>React · Next.js · Expo · Swift</span></div><div><strong>Services</strong><span>Node.js · Laravel · Python · Spring Boot</span></div><div><strong>Données</strong><span>PostgreSQL · SQLite · Supabase · Firebase</span></div><div><strong>Conception</strong><span>Architecture · flux · modélisation · IA appliquée</span></div></div></div>
          </section>

          <section className="journey-section section-pad" id="parcours"><Reveal className="section-heading-row"><span className="section-index">05 / Parcours</span><h2>Apprendre, construire,<br />livrer, recommencer.</h2></Reveal><div className="journey-list">
            {[['2020—2022', 'Premiers pas', 'Initiation au code avec mon frère, projets personnels, sites vitrines et aide sur des projets Arduino.'], ['2023—2026', 'Axis et missions clients', 'Développement de plateformes web et mobile, en parallèle de missions pour des clients dans l’immobilier, l’événementiel et le commerce.'], ['2023—2026', 'Formation à ISEP Diamniadio', 'Parcours Développement Frontend avec des modules backend et des projets full-stack. Soutenance validée en 2026; DISEP en attente de délivrance.']].map(([time, title, desc]) => <Reveal key={title}><div className="journey-row"><span>{time}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight size={18} weight="light" /></div></Reveal>)}</div></section>

          <section className="contact-section section-pad" id="contact"><div className="contact-copy"><span className="section-index">06 / Contact</span><Reveal><h2>Parlons d’un projet<br />qui mérite d’être bien conçu.</h2></Reveal><p>Je suis ouvert aux échanges sur des produits web et mobile, des missions full-stack et des équipes qui aiment comprendre le métier derrière le code.</p><a className="pill-button dark" href="mailto:Souleymaneseck996@gmail.com">M’écrire <ArrowUpRight size={16} /></a></div><div className="contact-side"><img src="/images/portrait.png" alt="" /><div><a href="mailto:Souleymaneseck996@gmail.com"><EnvelopeSimple size={19} /> Souleymaneseck996@gmail.com</a><a href="tel:+221772951688"><Globe size={19} /> +221 77 295 16 88</a><span><MapPin size={19} /> Dakar, Sénégal</span></div></div></section>
        </main>
        <footer><span>© {new Date().getFullYear()} Pape Souleymane Seck</span><span>Conçu et développé avec attention.</span><button onClick={() => go('accueil')}>Retour en haut <ArrowUpRight size={15} /></button></footer>
      </div>
      <AnimatePresence>{selected && <CaseDialog project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </>
  )
}

export default App
