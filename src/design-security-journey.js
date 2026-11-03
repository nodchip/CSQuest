import {evolutionVersions,evolutionClients,evolutionResult,evolutionVersionWorks} from './api-evolution.js';
import {defaultPolicies,defaultVisitors,defaultDecision} from './access-defaults.js';

export const designSecurityJourneyLevel={id:'village-design-security-journey',number:'1119',kind:'design-security-journey',name:'薬草帳と秘密の記録',tag:'設計と保護の遠征',title:'村の窓口から王城の記録庫へ',story:'薬師の村は薬草一覧の窓口を更新し、王城は別に保管する秘密の記録を守りたいそうです。二つの場所で設計を試してから知らせを届けましょう。'};
export const designSecurityPlaces={village:'薬師の村',castle:'王城の記録庫',guild:'冒険者ギルド'};
export function designSecurityReplay(history){
 if(!Array.isArray(history)||history.length>80)throw new RangeError('遠征記録が不正です。');
 const s={place:'village',version:'reorder',tested:[],villageDone:false,policy:'allow',visitors:[],castleDone:false,won:false,last:''};
 for(const a of history){
  if(typeof a!=='string'||s.won)throw new RangeError('遠征の操作が不正です。');
  if(a==='next'||a==='back'){const places=Object.keys(designSecurityPlaces),i=places.indexOf(s.place),j=i+(a==='next'?1:-1);if(j<0||j>=places.length)throw new RangeError('その方向へは進めません。');if(a==='next'&&s.place==='village'&&!s.villageDone)throw new RangeError('まず村で３人の利用と窓口を確認しましょう。');if(a==='next'&&s.place==='castle'&&!s.castleDone)throw new RangeError('まず王城で３人の訪問と番人の規則を確認しましょう。');s.place=places[j];s.last=`${designSecurityPlaces[s.place]}へ移動しました。`;}
  else if(s.place==='village'&&!s.villageDone&&a.startsWith('version:')){const v=a.slice(8);if(!Object.hasOwn(evolutionVersions,v))throw new RangeError('窓口の案が不正です。');if(s.version!==v){s.version=v;s.tested=[];}s.last='窓口の案を選びました。';}
  else if(s.place==='village'&&!s.villageDone&&a.startsWith('client:')){const c=a.slice(7);if(!Object.hasOwn(evolutionClients,c))throw new RangeError('利用者が不正です。');if(!s.tested.includes(c))s.tested.push(c);const r=evolutionResult(s.version,c);s.last=`${evolutionClients[c]}：${r.message} ${r.ok?'期待どおりです。':'期待と違います。'}`;}
  else if(s.place==='village'&&!s.villageDone&&a==='confirm:version'){if(s.tested.length<3)throw new RangeError('選んだ案で３人すべてを試しましょう。');if(!evolutionVersionWorks(s.version))s.last='期待どおりでない利用者がいます。案を変えて試し直しましょう。';else{s.villageDone=true;s.last='３人が使える案を村に渡しました。';}}
  else if(s.place==='castle'&&!s.castleDone&&a.startsWith('policy:')){const p=a.slice(7);if(!Object.hasOwn(defaultPolicies,p))throw new RangeError('番人の規則が不正です。');if(s.policy!==p){s.policy=p;s.visitors=[];}s.last='番人の規則を選びました。';}
  else if(s.place==='castle'&&!s.castleDone&&a.startsWith('visitor:')){const v=a.slice(8);if(!Object.hasOwn(defaultVisitors,v))throw new RangeError('訪問者が不正です。');if(!s.visitors.includes(v))s.visitors.push(v);s.last=`${defaultVisitors[v]}：${defaultDecision(s.policy,v)?'開きます。':'拒否します。'}`;}
  else if(s.place==='castle'&&!s.castleDone&&a==='confirm:policy'){if(s.visitors.length<3)throw new RangeError('選んだ規則で３人すべてを試しましょう。');if(defaultDecision(s.policy,'unknown'))s.last='許可のない旅人を通しています。規則を変えて試し直しましょう。';else{s.castleDone=true;s.last='薬師だけが読める規則を王城に渡しました。';}}
  else if(s.place==='guild'&&a==='report'&&s.villageDone&&s.castleDone){s.won=true;s.last='二つの場所の報告を届けました。';}
  else throw new RangeError('今いる場所と操作を確認しましょう。');
 }
 return s;
}
export function designSecurityCreate(){return {history:[]};}
export function designSecurityAct(q,a){const history=[...q.history,a],s=designSecurityReplay(history);q.history=history;return s;}
export function designSecurityRestore(q){if(!q)throw new RangeError('遠征記録が不正です。');designSecurityReplay(q.history);return {history:[...q.history]};}
