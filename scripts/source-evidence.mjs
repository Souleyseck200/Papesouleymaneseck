import fs from 'node:fs'
import path from 'node:path'
const roots={
 nps:'C:/Users/soule/Documents/Codex/2026-11-02/je-veux-faire-mon-cv-mais/work/repo-review/nps',siggil:'C:/Users/soule/Documents/Codex/2026-11-02/je-veux-faire-mon-cv-mais/work/repo-review/siggil',
 alertsec:'D:/laragon/www/Projet_Fin_Detude_AlertSec',edukora:'D:/Axis_Group/edukora-web',viva:'D:/VIVA_Partners',axis:'C:/Users/soule/Axis',jokko:'C:/Users/soule/jokko/JOKKO',maritime:'D:/space/maritime_backend',affiliation:'D:/Axis_Group/educora-portail-affiliation',maison:'C:/Users/soule/Documents/Codex/2026-11-03/salut-mon/work/maison-web',house:'D:/houseConnect',astronet:'D:/Spacial',timekeeper:'D:/Pointage/timekeeper-connect',agro:'D:/laragon/www/Agro',edupro:'D:/laragon/www/edupro-backend',dashboard:'D:/laragon/www/dashboard-backend',promessenger:'D:/laragon/www/ProMessenger',opendevin:'D:/Equipe/OpenDevin'
}
const skip=new Set(['node_modules','.git','.next','dist','build','vendor','.venv','venv','__pycache__','uploads','data','scratch','coverage','playwright-report','test-results','load_tests'])
function walk(dir,root,result=[]){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name.startsWith('.')||skip.has(item.name))continue;const full=path.join(dir,item.name);if(item.isDirectory())walk(full,root,result);else result.push(path.relative(root,full).replaceAll('\\','/'))}return result}
const out={}
for(const [id,root] of Object.entries(roots)){
 const files=walk(root,root)
 const packages=files.filter(f=>/(^|\/)package\.json$/.test(f)).filter(f=>!f.startsWith('docs/')).map(f=>{try{const p=JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));return {file:f,name:p.name,dependencies:p.dependencies||{}}}catch{return null}}).filter(Boolean)
 const pages=files.filter(f=>/\.(tsx|jsx|vue|blade\.php)$/.test(f)&&(/(^|\/)(pages|screens|views|routes)\//.test(f)||/app\/.*\.(tsx|jsx)$/.test(f))).filter(f=>!/(^|\/)(_layout|__root|layout|loading|error|not-found)\./.test(f)&&!f.includes('/components/'))
 const nextPages=files.filter(f=>/(^|\/)page\.(tsx|jsx)$/.test(f))
 const mobilePages=files.filter(f=>/(^|\/)(mobile|mobile-app)\/app\/.*\.tsx$/.test(f)&&!f.endsWith('_layout.tsx'))
 const routes=files.filter(f=>/route\.(ts|js)$/.test(f)||/(^|\/)(routes|controllers|Controllers)\//.test(f)&&/\.(ts|js|php|py)$/.test(f))
 out[id]={readmePresent:files.includes('README.md'),packages,pages:nextPages.length?nextPages:pages,mobilePages,routes,sourceFiles:files.filter(f=>/\.(ts|tsx|js|jsx|py|php|sql|cpp|hpp)$/.test(f)).length}
}
fs.mkdirSync('src/content',{recursive:true});fs.writeFileSync('src/content/source-evidence.json',JSON.stringify(out,null,2))
fs.writeFileSync('src/content/source-metrics.json',JSON.stringify(Object.fromEntries(Object.entries(out).map(([id,x])=>[id,{pages:x.pages.length,mobile:x.mobilePages.length,routeFiles:x.routes.length,pageExamples:x.pages.slice(0,8)}])),null,2))
console.log(Object.fromEntries(Object.entries(out).map(([id,x])=>[id,{pages:x.pages.length,mobile:x.mobilePages.length,routes:x.routes.length}])))
