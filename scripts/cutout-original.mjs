import sharp from 'sharp'
import fs from 'node:fs/promises'
const input = 'C:/Users/soule/.codex/codex-remote-attachments/01a19d7b-213e-7080-b971-795b362a563a/66E1A34B-7889-4858-B852-DAF720167438/2-Photo-2.jpg'
const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject:true })
const {width:w,height:h}=info
const background = new Uint8Array(w*h)
const seen = new Uint8Array(w*h)
const queue = new Int32Array(w*h)
let head=0,tail=0
function isGreen(i) { const r=data[i*3],g=data[i*3+1],b=data[i*3+2]; return g>r*1.15 && b>r*1.12 && g-r>12 && b-r>10 && Math.max(g,b)>25 }
function add(i) { if(i<0||i>=w*h||seen[i])return;seen[i]=1;if(isGreen(i)){background[i]=1;queue[tail++]=i} }
for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}
for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
while(head<tail){const i=queue[head++],x=i%w; if(x>0)add(i-1);if(x<w-1)add(i+1);if(i>=w)add(i-w);if(i<w*(h-1))add(i+w)}
const rgba=Buffer.alloc(w*h*4)
for(let i=0;i<w*h;i++){rgba[i*4]=data[i*3];rgba[i*4+1]=data[i*3+1];rgba[i*4+2]=data[i*3+2];rgba[i*4+3]=background[i]?0:255}
// RGB channels are copied unchanged. Only background alpha is removed.
await sharp(rgba,{raw:{width:w,height:h,channels:4}}).trim({background:'#00000000',threshold:0}).png().toFile('public/images/portrait-original-cutout.png')
await fs.copyFile(input,'public/images/portrait-original.jpg')
console.log('Original RGB preserved; transparent cutout written.')
