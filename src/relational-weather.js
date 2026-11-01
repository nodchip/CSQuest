export const relationalCases={sharedWet:{name:'同じ山・アオは濡れた',shared:true,observed:true},sharedDry:{name:'同じ山・アオは濡れない',shared:true,observed:false},separateWet:{name:'別々の山・アオは濡れた',shared:false,observed:true},separateDry:{name:'別々の山・アオは濡れない',shared:false,observed:false}};
// Equal weather priors; conditionally independent wetness with 8/10 or 2/10.
export function relationalCounts(shared){
 if(typeof shared!=='boolean')throw new RangeError('場所が不正です。');
 const weights=[[0,0],[0,0]];
 for(let ra=0;ra<2;ra++)for(let rb=0;rb<2;rb++){
  if(shared&&ra!==rb)continue;
  for(let a=0;a<2;a++)for(let b=0;b<2;b++){
   const aw=ra?8:2,bw=rb?8:2;
   weights[a][b]+=(a?aw:10-aw)*(b?bw:10-bw);
  }
 }
 const total=weights.flat().reduce((a,b)=>a+b,0);
 return weights.map(row=>row.map(w=>100*w/total));
}
export function relationalProbability(id){if(!Object.hasOwn(relationalCases,id))throw new RangeError('場面が不正です。');const c=relationalCases[id],row=relationalCounts(c.shared)[Number(c.observed)];return 100*row[1]/(row[0]+row[1]);}
export function createRelationalWeather(){return {selected:'sharedWet',answers:Object.fromEntries(Object.keys(relationalCases).map(k=>[k,null])),checked:Object.fromEntries(Object.keys(relationalCases).map(k=>[k,false]))};}
export function relationalCorrect(s,id){return s.checked[id]&&s.answers[id]===relationalProbability(id);}
export function relationalComplete(s){return Object.keys(relationalCases).every(id=>relationalCorrect(s,id));}
export function restoreRelationalWeather(s){if(!s||!Object.hasOwn(relationalCases,s.selected)||!s.answers||!s.checked)throw new RangeError('記録が不正です。');const n=createRelationalWeather();n.selected=s.selected;for(const id of Object.keys(relationalCases)){const a=s.answers[id],c=s.checked[id];if(![null,32,50,68].includes(a)||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id]=a;n.checked[id]=c;}return n;}
