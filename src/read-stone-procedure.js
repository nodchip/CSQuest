export const readingCases={mixed:{name:'正の数と奇数',values:[2,3,4]},negative:{name:'負の数と０',values:[0,-2,5]},empty:{name:'空の列',values:[]},odd:{name:'奇数だけ',values:[1,3]}};
export const readingOutputs=[-2,0,2,6];
export function readingResult(id){if(!Object.hasOwn(readingCases,id))throw new RangeError('列が不正です。');return readingCases[id].values.reduce((sum,n)=>sum+(n%2===0?n:0),0);}
export function createReading(){return {selected:'mixed',answers:Object.fromEntries(Object.keys(readingCases).map(k=>[k,null])),checked:Object.fromEntries(Object.keys(readingCases).map(k=>[k,false])),meaning:null,finished:false};}
export function readingCorrect(s,id){return s.checked[id]&&s.answers[id]===readingResult(id);}
export function readingComplete(s){return Object.keys(readingCases).every(id=>readingCorrect(s,id))&&s.meaning==='evenSum'&&s.finished;}
export function restoreReading(s){
 if(!s||!Object.hasOwn(readingCases,s.selected)||!s.answers||!s.checked||![null,'evenSum','count','allSum'].includes(s.meaning)||typeof s.finished!=='boolean')throw new RangeError('記録が不正です。');
 const n=createReading();n.selected=s.selected;n.meaning=s.meaning;n.finished=s.finished;
 for(const id of Object.keys(readingCases)){const a=s.answers[id],c=s.checked[id];if(!(a===null||readingOutputs.includes(a))||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id]=a;n.checked[id]=c;}return n;
}
