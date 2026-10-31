export const confidenceLevel={id:'village-confidence-interval',number:'433',kind:'confidence-interval',name:'薬草の標本と信頼区間',tag:'標本抽出・信頼区間',title:'区間の当たり方を調べよう',story:'薬師が薬草の長さを２本ずつ調べ、平均の推定にどれほど幅が必要か確かめます。'};
// The assumed population is a location family: theta plus these four offsets.
export const confidenceOffsets=[-1.5,-0.5,0.5,1.5];
export const confidenceWidths=[0.5,1];
export function confidenceInterval(theta,a,b,width){if(!Number.isFinite(theta)||!Number.isInteger(a)||a<0||a>3||!Number.isInteger(b)||b<0||b>3||!confidenceWidths.includes(width))throw new RangeError('標本または幅が不正です');const x=theta+confidenceOffsets[a],y=theta+confidenceOffsets[b],mean=(x+y)/2,low=mean-width,high=mean+width;return {x,y,mean,low,high,contains:low<=theta&&theta<=high};}
export function confidenceCoverage(width){let count=0;for(let a=0;a<4;a++)for(let b=0;b<4;b++)if(confidenceInterval(0,a,b,width).contains)count++;return count;}
export function createConfidence(){return {a:0,b:0,width:0.5,seen:[],surveyed:false,answer:null,checked:false};}
export function confidenceKey(a,b,width){return `${a},${b},${width}`;}
export function confidenceReady(s){return confidenceWidths.every(width=>[true,false].every(hit=>s.seen.some(k=>{const [a,b,w]=k.split(',').map(Number);return w===width&&confidenceInterval(4.5,a,b,w).contains===hit;})))&&s.surveyed;}
export function confidenceComplete(s){return confidenceReady(s)&&s.answer==='procedure'&&s.checked;}
export function restoreConfidence(s){if(!s||!Number.isInteger(s.a)||s.a<0||s.a>3||!Number.isInteger(s.b)||s.b<0||s.b>3||!confidenceWidths.includes(s.width)||!Array.isArray(s.seen)||s.seen.length>32||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>typeof k==='string'&&/^[0-3],[0-3],(0\.5|1)$/.test(k))||typeof s.surveyed!=='boolean'||![null,'procedure','fixed','data'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {a:s.a,b:s.b,width:s.width,seen:[...s.seen],surveyed:s.surveyed,answer:s.answer,checked:s.checked};}
