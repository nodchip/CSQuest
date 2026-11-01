export const cflPumpingLevel={id:'archive-cfl-pumping',number:'696',kind:'cfl-pumping',name:'三色の門と伸縮する巻物',tag:'文脈自由言語とポンピング補題',title:'三色が同数の巻物を調べよう',story:'門には a、b、c をこの順に同じ数だけ並べた巻物だけが通ります。巻物の一部を取り除き、山札を使う門の限界を考えましょう。'};
export function pumpingParts(p,start,v,x,y){
 if(!Number.isInteger(p)||p<1||p>8||![start,v,x,y].every(Number.isInteger)||start<0||start>=3*p||v<0||x<0||y<0||v+y===0||v+x+y>p||start+v+x+y>3*p)throw new RangeError('v と y は合わせて１文字以上、vxy は p 文字以下で、巻物の範囲内にしてください。');
 const word='a'.repeat(p)+'b'.repeat(p)+'c'.repeat(p),u=word.slice(0,start),partV=word.slice(start,start+v),partX=word.slice(start+v,start+v+x),partY=word.slice(start+v+x,start+v+x+y),z=word.slice(start+v+x+y),span=partV+partX+partY,pumped=u+partX+z;
 const counts=Object.fromEntries(['a','b','c'].map(c=>[c,[...pumped].filter(ch=>ch===c).length]));
 const touched=[...new Set(span)].join(''),category=touched.includes('a')&&touched.includes('b')?'ab':touched.includes('b')&&touched.includes('c')?'bc':'within';
 return {word,u,v:partV,x:partX,y:partY,z,span,pumped,counts,category,inLanguage:/^a*b*c*$/.test(pumped)&&counts.a===counts.b&&counts.b===counts.c};
}
export function createCflPumping(){return {p:2,start:0,v:1,x:0,y:0,observed:[],answer:null,checked:false};}
export function cflPumpingComplete(s){const set=new Set(s.observed),has=category=>[2,3].some(p=>set.has(`${p},${category}`));return s.checked&&has('within')&&has('ab')&&has('bc')&&[2,3].every(p=>['within','ab','bc'].some(category=>set.has(`${p},${category}`)))&&s.answer==='all';}
export function restoreCflPumping(s){if(!s||![2,3].includes(s.p)||!Number.isInteger(s.start)||s.start<0||s.start>=3*s.p||![s.v,s.x,s.y].every(n=>Number.isInteger(n)&&n>=0&&n<=s.p)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!['2,within','2,ab','2,bc','3,within','3,ab','3,bc'].includes(k))||![null,'all','one','some'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
