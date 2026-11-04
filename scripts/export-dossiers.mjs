import fs from 'node:fs'
import { deepProjects } from '../src/content/deep-projects.js'
import { deepExtras } from '../src/content/deep-extras.js'
import { models, logicalModels } from '../src/models.js'
const target='../portfolio-audit/enriched'
fs.mkdirSync(target,{recursive:true})
for(const [id,p] of Object.entries({...deepProjects,...deepExtras})){
 let md=`# ${id} — dossier full-stack\n\n## But du projet\n\n${p.purpose}\n\n`
 for(const [heading,key] of [['Interfaces et expérience utilisateur','front'],['Services et règles métier','back']]){
  md+=`## ${heading}\n\n`
  for(const [name,description] of p[key])md+=`### ${name}\n\n${description}\n\n`
 }
 md+='## Méthodes et choix techniques\n\n'+p.methods.map(x=>'- '+x).join('\n')+'\n\n'
 if(p.architecture)md+='## Architecture des modules\n\n```mermaid\n'+p.architecture+'\n```\n\n'
 if(p.sequence)md+='## Séquence d’une opération\n\n```mermaid\n'+p.sequence+'\n```\n\n'
 md+='## Flux détaillé\n\n'+p.steps.map((x,i)=>(i+1)+'. '+x).join('\n')+'\n\n'
 md+='## Cycle de vie des données\n\n'+p.lifecycle+'\n\n'
 if(models[id])md+='## Modèle conceptuel\n\n```mermaid\n'+models[id]+'\n```\n\n'
 if(logicalModels[id])md+='## Modèle logique — tables étudiées\n\n| Tables | Responsabilité |\n|---|---|\n'+logicalModels[id].map(([n,d])=>'| '+n+' | '+d+' |').join('\n')+'\n\n'
 md+='## Sources de rédaction\n\n'+(p.sources.length?p.sources.map(x=>'- `'+x+'`').join('\n'):'Périmètre décrit par Pape; dépôt source correspondant non disponible dans les chemins transmis.')+'\n'
 fs.writeFileSync(`${target}/${id}.md`,md)
}
console.log('Dossiers full-stack exportés : '+Object.keys({...deepProjects,...deepExtras}).length)
