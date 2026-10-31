export const transformLevel={id:'ruin-emblem',number:'26',kind:'transform',name:'回転する遺跡の紋章',tag:'図形の変換',title:'二つの紋章を合わせよう',story:'遺跡の扉には二つの紋章があります。光の印を平行移動し、原点の周りに回して、扉の模様に合わせましょう。'};
export const original=[[1,0],[2,0],[1,1]];
export const operations={move:{name:'右へ１移動',description:'印のすべての点を右へ１動かします。'},rotate:{name:'原点の周りに左へ90度回転',description:'格子の中心を軸に反時計回りに90度回します。'}};
export const targets={first:{name:'扉の紋章 A',sequence:['move','rotate']},second:{name:'扉の紋章 B',sequence:['rotate','move']}};
export function transform(points,operation){
  if(!Object.hasOwn(operations,operation))throw new RangeError('未知の変換です。');
  return points.map(([x,y])=>operation==='move'?[x+1,y]:[y===0?0:-y,x]);
}
export function applySequence(sequence){
  if(!Array.isArray(sequence)||sequence.length!==2||sequence.some(id=>!Object.hasOwn(operations,id)))throw new RangeError('変換の組合せが不正です。');
  return sequence.reduce((points,id)=>transform(points,id),original.map(point=>point.slice()));
}
export function matches(sequence,target){
  if(!Object.hasOwn(targets,target))throw new RangeError('未知の扉です。');
  return JSON.stringify(applySequence(sequence))===JSON.stringify(applySequence(targets[target].sequence));
}
export function createTransform(){return {selected:'first',sequences:{first:['move','move'],second:['move','move']},tested:{first:false,second:false}};}
export function restoreTransform(saved){
  if(!saved||!Object.hasOwn(targets,saved.selected)||!saved.sequences||!saved.tested)throw new RangeError('途中記録が不正です。');
  const state=createTransform();state.selected=saved.selected;
  for(const id of Object.keys(targets)){applySequence(saved.sequences[id]);if(typeof saved.tested[id]!=='boolean')throw new RangeError('途中記録が不正です。');state.sequences[id]=saved.sequences[id].slice();state.tested[id]=saved.tested[id];}
  return state;
}
export function transformComplete(state){return Object.keys(targets).every(id=>state.tested[id]&&matches(state.sequences[id],id));}
