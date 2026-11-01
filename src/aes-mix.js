export const aesMixLevel={id:'castle-aes-mix',number:'613',kind:'aes-mix',name:'四つの魔石を混ぜる炉',tag:'AES の MixColumns',title:'一つの変化が列に広がる様子を調べよう',story:'魔導炉は四つの魔石を混ぜ、新しい四つの印を作ります。一つの印を変えると、どこに影響が出るでしょう。'};
export const aesMixInputs={original:[0xd4,0xbf,0x5d,0x30],flipped:[0xd4,0xbf,0x5d,0x31]};
export const aesMixMatrix=[[2,3,1,1],[1,2,3,1],[1,1,2,3],[3,1,1,2]];
const inverseMatrix=[[14,11,13,9],[9,14,11,13],[13,9,14,11],[11,13,9,14]];
export const byteHex=n=>n.toString(16).padStart(2,'0');
export function gfMultiply(a,b){
 if(!Number.isInteger(a)||a<0||a>255||!Number.isInteger(b)||b<0||b>255)throw new RangeError('バイトが不正です');
 let product=0;for(let i=0;i<8;i++){if(b&1)product^=a;a=(a<<1)^((a&0x80)?0x11b:0);b>>=1;}return product;
}
function transform(column,matrix){
 if(!Array.isArray(column)||column.length!==4||column.some(x=>!Number.isInteger(x)||x<0||x>255))throw new RangeError('列が不正です');
 return matrix.map(row=>row.reduce((v,k,i)=>v^gfMultiply(column[i],k),0));
}
export const mixColumn=column=>transform(column,aesMixMatrix);
export const inverseMixColumn=column=>transform(column,inverseMatrix);
export function mixTerms(which,row){
 if(!Object.hasOwn(aesMixInputs,which)||!Number.isInteger(row)||row<0||row>3)throw new RangeError('行が不正です');
 return aesMixMatrix[row].map((coefficient,i)=>({coefficient,input:aesMixInputs[which][i],value:gfMultiply(aesMixInputs[which][i],coefficient)}));
}
export function createAesMix(){return {which:'original',row:0,guess:null,solved:[],deltaGuess:null,deltaChecked:false,answer:null,checked:false};}
export function aesMixComplete(s){return ['original','flipped'].every(w=>[0,1,2,3].every(i=>s.solved.includes(w+i)))&&s.deltaChecked&&s.deltaGuess===4&&s.answer==='diffusion'&&s.checked;}
export function restoreAesMix(s){
 const validId=id=>['original','flipped'].some(w=>[0,1,2,3].some(i=>id===w+i));
 if(!s||!Object.hasOwn(aesMixInputs,s.which)||!Number.isInteger(s.row)||s.row<0||s.row>3||!(s.guess===null||Number.isInteger(s.guess)&&s.guess>=0&&s.guess<=255)||!Array.isArray(s.solved)||new Set(s.solved).size!==s.solved.length||s.solved.some(id=>!validId(id))||![null,0,1,2,3,4].includes(s.deltaGuess)||typeof s.deltaChecked!=='boolean'||![null,'diffusion','encrypt','allBits'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,solved:[...s.solved]};
}
