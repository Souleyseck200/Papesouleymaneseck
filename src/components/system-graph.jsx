import { memo, useMemo } from 'react'
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react'
import { useReducedMotion } from 'framer-motion'
import { DeviceMobile, Database, Monitor, Code, Cloud, Users, Cpu, Files, Check } from '@phosphor-icons/react'

const icons = { mobile: DeviceMobile, data: Database, screen: Monitor, code: Code, cloud: Cloud, users: Users, cpu: Cpu, files: Files, check: Check }
const Node = memo(function Node({ data, selected }) {
  const Icon = icons[data.icon] || Code
  return <div className={`min-w-39 rounded-2xl border bg-white px-4 py-3 shadow-[0_3px_12px_#00000006] transition-all ${selected ? 'border-orange-400 ring-4 ring-orange-100' : 'border-neutral-200'}`}>
    <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-neutral-400" />
    <div className="mb-2 flex items-center gap-2 text-neutral-400"><Icon size={17} weight="light" /><span className="text-[10px]">{data.kind}</span></div>
    <div className="text-[12px] font-medium text-neutral-900">{data.label}</div>
    <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-neutral-400" />
  </div>
})
const nodeTypes = { system: Node }
const n = (id, label, kind, icon, x, y) => ({ id, type: 'system', data: { label, kind, icon }, position: { x, y } })
const definitions = {
  alertsec: {
    nodes: [n('citoyen','Application citoyen','Mobile · Expo','mobile',0,90),n('api','API Node.js','Services métier','code',230,90),n('db','Prisma / SQLite','Persistance','data',470,-20),n('rt','Socket.IO','Événements','cloud',470,180),n('agent','Application agent','Mobile · Expo','mobile',710,100),n('pc','Commandement','Desktop · Electron','screen',710,250)],
    links: [['citoyen','api'],['api','db'],['api','rt'],['rt','agent'],['rt','pc']],
  },
  edukora: {
    nodes: [n('roles','Profils de l’école','Direction et utilisateurs','users',0,90),n('web','Espaces Next.js','Interface et routes API','screen',230,90),n('sql','Modules SQL','Organisation métier','code',460,90),n('db','PostgreSQL','Données de l’école','data',690,10),n('aff','Portail affiliation','Synchronisation','cloud',690,180)],
    links: [['roles','web'],['web','sql'],['sql','db'],['aff','db']],
  },
  viva: {
    nodes: [n('ui','Espaces de gestion','React','screen',0,80),n('state','Stores et repositories','Zustand / services','code',235,80),n('rpc','RPC métier','Règles financières','cpu',470,80),n('db','PostgreSQL','Biens et comptabilité','data',710,0),n('docs','Documents','Génération et stockage','files',710,170)],
    links: [['ui','state'],['state','rpc'],['rpc','db'],['rpc','docs']],
  },
  jokko: {
    nodes: [n('app','Client mobile','Expo','mobile',0,100),n('server','Fastify / WebSocket','API et protocole','cloud',245,100),n('db','SQLite','Ordre et idempotence','data',490,100),n('shared','Contrats partagés','TypeScript / Zod','code',245,-70),n('ack','ACK et reprise','Confirmation serveur','check',735,100)],
    links: [['app','server'],['shared','app'],['shared','server'],['server','db'],['db','ack']],
  },
  axis: {
    nodes: [n('brief','Brief client','Parcours guidé','users',0,80),n('api','API Express','Cadrage du besoin','code',225,80),n('ai','Service Gemini','Traitement assisté','cpu',450,0),n('db','Supabase','Données et académie','data',450,170),n('doc','Dossier structuré','Revue humaine','files',690,80)],
    links: [['brief','api'],['api','ai'],['api','db'],['ai','doc']],
  },
  maritime: {
    nodes: [n('source','Scènes Sentinel','Source satellite','cloud',0,80),n('tile','Tuiles raster','Rasterio / NumPy','code',220,80),n('yolo','Détection YOLO','Vision par ordinateur','cpu',440,80),n('geo','Position GPS','Projection géographique','data',660,80),n('fusion','Fusion multi-source','Modules de rapprochement','files',880,80)],
    links: [['source','tile'],['tile','yolo'],['yolo','geo'],['geo','fusion']],
  },
}

export function SystemGraph({ project }) {
  const reduced = useReducedMotion()
  const definition = useMemo(() => definitions[project.id] || {
    nodes: project.flows.map((label, index) => n(String(index),label.split(' ').slice(0,5).join(' '),'Étape du parcours',index === 0 ? 'users' : 'code',index * 230,60)),
    links: project.flows.slice(1).map((_, index) => [String(index), String(index+1)]),
  }, [project])
  const [nodes, , onNodesChange] = useNodesState(definition.nodes)
  const [edges, , onEdgesChange] = useEdgesState(definition.links.map(([source,target],i) => ({ id: `${source}-${target}-${i}`, source, target, type: 'smoothstep', animated: !reduced, style: { stroke: '#b6bcbb' } })))
  return <div className="h-76 w-full overflow-hidden rounded-[22px] bg-[#f6f6f2] sm:h-88" role="region" aria-label={`Architecture interactive de ${project.title}`}>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView fitViewOptions={{ padding:.16 }} minZoom={.3} maxZoom={1.5} panOnScroll={false} zoomOnScroll={false} zoomOnDoubleClick={false} preventScrolling={false} nodesConnectable={false} colorMode="light">
      <Background gap={18} size={1} color="#dfe1d9" />
      <Controls showInteractive={false} position="bottom-left" className="!overflow-hidden !rounded-xl !border !border-neutral-200 !shadow-none" />
    </ReactFlow>
  </div>
}
