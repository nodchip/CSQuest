import {unifyStep,unifyNext,unifyFormat} from './unification.js';
export const narrowingLevel={id:'ruin-narrowing',number:'776',kind:'narrowing',name:'未知の石と二つの規則',tag:'ナローイングと待機',title:'未知の石を調べよう',story:'遺跡の門は、まだ決まっていない石の数を調べます。外から数が決まるのを待つ方法と、規則に合う形を探索する方法を比べましょう。'};
export const narrowingCases={waitZero:{name:'待って０を受け取る',mode:'wait',external:'zero'},waitSucc:{name:'待って後続を受け取る',mode:'wait',external:'succ'},narrowLight:{name:'点灯する条件を探す',mode:'narrow',goal:true},narrowDark:{name:'消灯する条件を探す',mode:'narrow',goal:false}};
const pattern=kind=>kind==='zero'?{type:'atom',name:'０'}:{type:'term',name:'後続',args:[{type:'var',name:'Y'}]};
export function narrowingUnify(kind){if(!['zero','succ'].includes(kind))throw new RangeError('規則が不正です。');let u={equations:[[{type:'var',name:'X'},pattern(kind)]],env:{},status:'playing',history:[],message:''};for(const action of ['bind','success']){if(unifyNext(u)!==action)throw new Error('単一化の規則が不正です。');u=unifyStep(u,action);}return {term:unifyFormat(u.env.X),status:u.status};}
const fresh=()=>({suspended:false,binding:null,evaluated:false,result:null,checked:false,branches:{zero:{stage:0,result:null,checked:false},succ:{stage:0,result:null,checked:false}}});
export function narrowingReplay(id,history){
 const c=narrowingCases[id];if(!c||!Array.isArray(history)||history.length>8)throw new RangeError('履歴が不正です。');const r=fresh();
 for(const entry of history){if(!entry||typeof entry.action!=='string')throw new RangeError('履歴が不正です。');const [op,kind]=entry.action.split(':');
  if(c.mode==='wait'){
   if(op==='try'&&!r.suspended&&!r.binding)r.suspended=true;
   else if(op==='bind'&&r.suspended&&!r.binding&&kind===c.external)r.binding=kind;
   else if(op==='eval'&&r.binding&&!r.evaluated){r.evaluated=true;r.result=r.binding==='zero';}
   else if(op==='check'&&r.evaluated&&!r.checked&&typeof entry.guess==='boolean'&&entry.guess===r.result)r.checked=true;
   else throw new RangeError('待機の手順が不正です。');
  }else{
   const b=r.branches[kind];if(!b)throw new RangeError('枝が不正です。');
   if(op==='open'&&b.stage===0)b.stage=1;
   else if(op==='unify'&&b.stage===1){const u=narrowingUnify(kind);if(u.status!=='unified')throw new Error('単一化に失敗しました。');b.binding=u.term;b.stage=2;}
   else if(op==='eval'&&b.stage===2){b.result=kind==='zero';b.stage=3;}
   else if(op==='check'&&b.stage===3&&!b.checked&&typeof entry.guess==='boolean'&&entry.guess===(b.result===c.goal))b.checked=true;
   else throw new RangeError('探索の手順が不正です。');
  }
 }
 return r;
}
export function narrowingCreate(){return {selected:'waitZero',branch:'zero',guess:null,trials:Object.fromEntries(Object.keys(narrowingCases).map(id=>[id,[]])),answer:'',checked:false};}
export function narrowingStep(s,action){const id=s.selected,c=narrowingCases[id],entry={action};if(action.startsWith('check'))entry.guess=s.guess;try{narrowingReplay(id,[...s.trials[id],entry]);}catch{if(action.startsWith('check'))return {ok:false,message:'結果と、この場面で調べる条件を比べて予想を選びましょう。'};return {ok:false,message:'今の状態と、先に必要な操作を確かめましょう。'};}s.trials[id].push(entry);s.guess=null;const op=action.split(':')[0];return {ok:true,message:({try:'未知のままでは規則を選べないため待機します。',bind:'外から石の形が決まりました。',open:'この規則の枝を用意しました。',unify:'未知の石と規則の形を単一化しました。',eval:'規則を適用し、灯りの結果が分かりました。',check:c.mode==='wait'?'灯りの結果を確認しました。':'この枝が条件に合うか確認しました。'})[op]};}
export function narrowingDone(id,history){const c=narrowingCases[id],r=narrowingReplay(id,history);return c.mode==='wait'?r.checked:r.branches.zero.checked&&r.branches.succ.checked;}
export function narrowingComplete(s){return Object.keys(narrowingCases).every(id=>narrowingDone(id,s.trials[id]))&&s.answer==='wait-branch'&&s.checked;}
export function narrowingRestore(s){if(!s||!Object.hasOwn(narrowingCases,s.selected)||!['zero','succ'].includes(s.branch)||![null,true,false].includes(s.guess)||!s.trials||!['','wait-branch','always-wait','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=narrowingCreate();out.selected=s.selected;out.branch=s.branch;out.guess=s.guess;out.answer=s.answer;out.checked=s.checked;for(const id of Object.keys(narrowingCases)){narrowingReplay(id,s.trials[id]);out.trials[id]=s.trials[id].map(x=>({...x}));}return out;}
