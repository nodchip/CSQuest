export const secretSharingLevel={id:'castle-secret-sharing',number:'604',kind:'secret-sharing',name:'三つの欠片と封印の鍵',tag:'秘密分散と復元',title:'欠片を集めて封印を開こう',story:'王城の封印は、三人の守り手に分けた欠片のうち二つで開きます。一つの欠片から秘密が分かるか、別々の組で試しましょう。'};
const mod=n=>((n%11)+11)%11;
export const shareValue=(secret,slope,x)=>mod(secret+slope*x);
export function possibleSecrets(shares){
 if(!Array.isArray(shares)||shares.length>3||shares.some(p=>!Number.isInteger(p.x)||p.x<1||p.x>3||!Number.isInteger(p.y)||p.y<0||p.y>10)||new Set(shares.map(p=>p.x)).size!==shares.length)throw new RangeError('欠片が不正です');
 const matches=[];
 for(let secret=0;secret<11;secret++)for(let slope=0;slope<11;slope++)if(shares.every(p=>shareValue(secret,slope,p.x)===p.y))matches.push({secret,slope});
 return matches;
}
export function createSecretSharing(){return {secret:4,slope:3,made:false,selected:[],guess:null,single:false,pairs:[],answer:null,checked:false};}
export function sharingShares(s){return [1,2,3].map(x=>({x,y:shareValue(s.secret,s.slope,x)}));}
export function sharingTrial(s){
 const shares=sharingShares(s).filter(p=>s.selected.includes(p.x)),matches=possibleSecrets(shares);
 if(shares.length===1){const alternative=matches.find(m=>m.secret===s.guess&&m.secret!==s.secret);return {correct:!!alternative,matches,alternative};}
 if(shares.length===2){return {correct:matches.length===1&&matches[0].secret===s.guess,matches};}
 return {correct:false,matches};
}
export function sharingComplete(s){return s.made&&s.single&&['12','13','23'].every(p=>s.pairs.includes(p))&&s.answer==='threshold'&&s.checked;}
export function restoreSecretSharing(s){
 const digit=n=>Number.isInteger(n)&&n>=0&&n<=10;
 if(!s||!digit(s.secret)||!digit(s.slope)||typeof s.made!=='boolean'||!Array.isArray(s.selected)||s.selected.length>2||s.selected.some(x=>![1,2,3].includes(x))||new Set(s.selected).size!==s.selected.length||!(s.guess===null||digit(s.guess))||typeof s.single!=='boolean'||!Array.isArray(s.pairs)||s.pairs.some(x=>!['12','13','23'].includes(x))||new Set(s.pairs).size!==s.pairs.length||![null,'threshold','one','all'].includes(s.answer)||typeof s.checked!=='boolean'||(!s.made&&(s.single||s.pairs.length)))throw new RangeError('保存データが不正です');
 return {...s,selected:[...s.selected],pairs:[...s.pairs]};
}
