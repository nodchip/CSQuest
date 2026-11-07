import {gate} from './circuit.js';
import {estimateTasks} from './estimate-schedule.js';

export const midQuests={
  'archive-search':{region:'archive',title:'薬草の記録を探そう',short:'番号で記録を探す'},
  'archive-filter':{region:'archive',title:'山への本を選ぼう',short:'届ける本を選ぶ'},
  'windmill-lamp':{region:'windmill',title:'風車の安全灯を直そう',short:'安全灯を直す'},
  'windmill-order':{region:'windmill',title:'橋の道具を準備しよう',short:'橋の準備を進める'},
};
export const midIds=Object.keys(midQuests);
export const recordNumbers=[10,20,30,40,50,60,70];
export const archiveBooks=[
  {name:'山の薬草図鑑',book:true,mountain:true},
  {name:'山道の手引き',book:true,mountain:true},
  {name:'森の絵本',book:true,mountain:false},
  {name:'山の地図',book:false,mountain:true},
];
export const windTasks=[
  {id:'A',name:'橋の様子を調べる'},
  {id:'B',name:'板を用意する'},
  {id:'C',name:'灯りを用意する'},
  {id:'D',name:'橋に取り付ける'},
].map(task=>({...task,needs:estimateTasks.find(item=>item.id===task.id).needs}));
export function midUnlocked(completed){return completed.includes('harbor-message');}
export function bridgeReady(completed){return midIds.some(id=>midQuests[id].region==='archive'&&completed.includes(id))&&midIds.some(id=>midQuests[id].region==='windmill'&&completed.includes(id));}
export function midReplay(id,history){
  if(!Object.hasOwn(midQuests,id)||!Array.isArray(history)||history.length>100)throw new RangeError('依頼の記録が不正です。');
  let done=false,lo=0,hi=recordNumbers.length-1,book=false,mountain=false,part='OR',tested=false,chosen=[];
  for(const action of history){
    if(done||typeof action!=='string')throw new RangeError('依頼の記録が不正です。');
    if(id==='archive-search'){
      if(!/^pick:[0-6]$/.test(action))throw new RangeError('番号を選び直してください。');
      const index=Number(action.slice(5));if(index<lo||index>hi)throw new RangeError('まだ調べられる番号を選んでください。');
      const value=recordNumbers[index];if(value===50)done=true;else if(value<50)lo=index+1;else hi=index-1;
    }else if(id==='archive-filter'){
      if(action==='book'){book=!book;tested=false;}else if(action==='mountain'){mountain=!mountain;tested=false;}
      else if(action==='test'){tested=true;done=book&&mountain;}else throw new RangeError('条件を選び直してください。');
    }else if(id==='windmill-lamp'){
      if(['AND','OR','NAND'].includes(action)){part=action;tested=false;}
      else if(action==='test'){tested=true;done=part==='AND';}else throw new RangeError('部品を選び直してください。');
    }else{
      const task=windTasks.find(t=>t.id===action);if(!task||chosen.includes(action)||!task.needs.every(need=>chosen.includes(need)))throw new RangeError('先に必要な準備を確かめましょう。');
      chosen.push(action);done=chosen.length===windTasks.length;
    }
  }
  const books=archiveBooks.filter(item=>gate('AND',Number(!book||item.book),Number(!mountain||item.mountain))===1);
  const rows=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>({a,b,actual:gate(part,a,b),expected:gate('AND',a,b)}));
  return {done,lo,hi,book,mountain,part,tested,chosen,books,rows};
}
export function validMidDrafts(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(id=>!midIds.includes(id)))return false;
  try{for(const [id,history] of Object.entries(value))midReplay(id,history);return true;}catch{return false;}
}
