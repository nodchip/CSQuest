import {samplingValues} from './temporal-sampling.js';
import {mediaProblems} from './media-delivery.js';
import {lcdOutput} from './lcd-workshop.js';
import {halftoneCheckPattern} from './halftone-press.js';

export const imageRescueLevel={id:'ruin-image-rescue',number:'955',kind:'image-rescue',name:'星祭りの記録を取り戻す',tag:'標本化・画像形式・表示・印刷',title:'光と記録の祭壇へ',story:'星祭りの灯りと案内板が消えました。遺跡を巡り、光を記録し、紋章と印刷を届けて番人を越えましょう。'};
export const imagePlaces={camp:'遺跡入口',observatory:'観測塔',archive:'記録の書庫',display:'光の工房',press:'印刷の間',gate:'番人の門',festival:'星祭りの祭壇'};
const edges=[['camp','observatory'],['camp','archive'],['camp','display'],['camp','press'],['camp','gate'],['gate','festival']];
export function imageNeighbors(place){if(!Object.hasOwn(imagePlaces,place))throw new RangeError('場所が不正です。');return edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function imageCreate(){return {place:'camp',health:3,rate:4,observed:[],sampleReady:false,format:'jpeg',packageReady:false,voltage:[false,false,false],displayReady:false,cells:[false,false,false,false],printReady:false,round:0,status:'playing',history:[]};}
export function imageAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=250||s.status!=='playing'||typeof action!=='string')return {ok:false,message:'旅を続けられません。最初からやり直してください。'};
 const n={...s,observed:[...s.observed],voltage:[...s.voltage],cells:[...s.cells],history:[...s.history]};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);if(!imageNeighbors(s.place).includes(dest))return {ok:false,message:'つながった道を選びましょう。'};
  if(dest==='gate'&&!(s.sampleReady&&s.packageReady&&s.displayReady&&s.printReady))return {ok:false,message:'４つの場所で準備を終えてから門へ向かいましょう。'};
  if(dest==='festival'&&s.round<2)return {ok:false,message:'先に番人の２つの封印を解きましょう。'};
  n.place=dest;if(dest==='festival'){n.status='won';message='祭壇に光と記録が届きました！';}else message=`${imagePlaces[dest]}に移動しました。`;
 }else if(action==='rest'&&s.place==='camp'){n.health=3;message='入口で休み、体力を回復しました。';}
 else if(s.place==='observatory'&&['rate:4','rate:8','rate:12'].includes(action)){n.rate=Number(action.slice(5));message='記録の速さを選びました。';}
 else if(s.place==='observatory'&&action==='observe'){
  if(!n.observed.includes(s.rate))n.observed.push(s.rate);
  const slow=samplingValues(1,s.rate),fast=samplingValues(5,s.rate);message=`１回の光：${slow.join(' / ')}。５回の光：${fast.join(' / ')}。`;
 }
 else if(s.place==='observatory'&&action==='record'){
  if(!s.observed.includes(4)||!s.observed.includes(12))return {ok:false,message:'４回と12回の記録を両方調べて比べましょう。'};
  if(s.rate!==12){message='この例の最高周波数５ Hz の２倍、10 Hz より多い速度を選びましょう。';}else{n.sampleReady=true;message='12 Hz の記録を確保しました。';}
 }
 else if(s.place==='archive'&&['jpeg','png','gif','mp3','mp4'].some(x=>action===`format:${x}`)){n.format=action.slice(7);message='届ける記録を選びました。';}
 else if(s.place==='archive'&&action==='pack'){
  const problems=mediaProblems('logo',s.format);if(problems.length){message=problems.join(' ');}else{n.packageReady=true;message='正確な画素と半透明を保つ紋章を包みました。';}
 }
 else if(s.place==='display'&&['channel:0','channel:1','channel:2'].includes(action)){
  const i=Number(action.slice(8));n.voltage[i]=!n.voltage[i];n.displayReady=false;message='小窓の電圧を切り替えました。';
 }
 else if(s.place==='display'&&action==='light'){
  if(!s.packageReady)return {ok:false,message:'先に書庫で紋章を包みましょう。'};
  const out=lcdOutput(true,s.voltage);n.displayReady=out.join(',')==='0,1,1';message=n.displayReady?'緑と青を通し、シアンの窓に紋章を映しました。':`出力は赤・緑・青の順に ${out.join(' / ')}。シアンは緑と青を通します。`;
 }
 else if(s.place==='press'&&['cell:0','cell:1','cell:2','cell:3'].includes(action)){
  const i=Number(action.slice(5));n.cells[i]=!n.cells[i];n.printReady=false;message='版の点を切り替えました。';
 }
 else if(s.place==='press'&&action==='print'){
  const r=halftoneCheckPattern(2,s.cells);n.printReady=r.correct;message=r.correct?'０と１の場所に黒点を置き、案内を刷りました。':r.countCorrect?'点は２つです。番号０と１の場所を確認しましょう。':'黒点を２つ、番号０と１の場所に置きましょう。';
 }
 else if(s.place==='gate'&&action.startsWith('ward:')&&s.round<2){
  const choices=s.round===0?['fast','eight','any']:['two','four','one'];const choice=action.slice(5);if(!choices.includes(choice))return {ok:false,message:'今の封印に対応する札を選びましょう。'};
  const correct=choice===(s.round===0?'fast':'two');if(correct){n.round++;message=n.round===2?'二つ目の封印も解けました。祭壇へ進めます。':'一つ目の封印が解けました。次の印を確認しましょう。';}
  else{n.health--;message=s.round===0?'５ Hz の光には10 Hz より多い記録速度を選びます。':'４場所の半分は黒点２つです。';if(n.health===0){n.place='camp';n.health=3;n.round=0;message+=' 入口で休み、番人との対決を最初からやり直します。準備は残ります。';}}
 }else return {ok:false,message:'今いる場所と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function imageRestore(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>250)throw new RangeError('途中記録が不正です。');let s=imageCreate();for(const action of saved.history){const r=imageAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
