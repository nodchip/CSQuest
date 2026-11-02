export const nearLevel={id:'workshop-near-memory',number:'874',kind:'near-memory',name:'魔石庫で集める数',tag:'メモリ近傍での処理',title:'記録を運ぶ前に集計しよう',story:'魔石庫の８枚の記録を使い、合計と全記録をギルドへ届けます。計算する場所を選び、運ぶ量を比べましょう。'};
export const nearValues=[2,5,1,4,3,1,2,6];
export const nearCases={sum:'合計だけ届ける',all:'８枚すべて届ける'};
export const nearModes={cpu:'ギルド側で調べる',near:'魔石庫の近くで調べる'};
export function nearReplay(scenario,mode,actions){
 if(!Object.hasOwn(nearCases,scenario)||!Object.hasOwn(nearModes,mode)||!Array.isArray(actions))throw new RangeError('条件が不正です。');
 let scanned=0,sent=false,words=0,total=0;
 for(const action of actions){
  if(action==='send'){
   if(sent||(mode==='near'&&scanned!==nearValues.length))throw new RangeError('この時点では運べません。');
   sent=true;words=mode==='near'&&scenario==='sum'?1:nearValues.length;
  }else if(action==='scan'){
   if(scanned>=nearValues.length||(mode==='cpu'&&!sent))throw new RangeError('先に記録を届けるか、残りの札を確かめましょう。');
   total+=nearValues[scanned++];
  }else throw new RangeError('操作が不正です。');
 }
 return {scanned,sent,words,total,done:sent&&scanned===nearValues.length};
}
export function nearCreate(){return {scenario:'sum',mode:'cpu',trials:{sum:{cpu:[],near:[]},all:{cpu:[],near:[]}},answer:null};}
export function nearComplete(q){return Object.keys(nearCases).every(s=>Object.keys(nearModes).every(m=>nearReplay(s,m,q.trials[s][m]).done))&&q.answer==='tradeoff';}
export function nearRestore(q){if(!q||!Object.hasOwn(nearCases,q.scenario)||!Object.hasOwn(nearModes,q.mode)||![null,'tradeoff','always','none'].includes(q.answer))throw new RangeError('記録が不正です。');const r=nearCreate();r.scenario=q.scenario;r.mode=q.mode;r.answer=q.answer;for(const s of Object.keys(nearCases))for(const m of Object.keys(nearModes)){const a=q.trials?.[s]?.[m];nearReplay(s,m,a);r.trials[s][m]=[...a];}return r;}
