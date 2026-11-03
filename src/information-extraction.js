export const informationExtractionLevel={id:'forest-message-extraction',number:'1080',kind:'information-extraction',name:'伝言から作る配送台帳',tag:'情報抽出と文脈',title:'森の伝言を台帳にまとめる',story:'旅人から届いた３枚の伝言を読み、配送の台帳を作りましょう。名前だけでなく、実行されたかどうかにも気をつけます。'};
export const extractionCases={done:{name:'届いた知らせ',text:'ミラは港に薬草を届けた。',answer:{actor:'mira',place:'port',status:'done'}},negated:{name:'届かなかった知らせ',text:'ミラは港に薬草を届けなかった。',answer:{actor:'mira',place:'port',status:'negated'}},planned:{name:'これからの知らせ',text:'ノノは塔に薬草を届ける予定だ。',answer:{actor:'nono',place:'tower',status:'planned'}}};
export const extractionChoices={actor:{mira:'ミラ',nono:'ノノ'},place:{port:'港',tower:'塔'},status:{done:'届けた',negated:'届けなかった',planned:'届ける予定'}};
export function extractionCreate(){return {case:'done',runs:Object.fromEntries(Object.keys(extractionCases).map(id=>[id,{actor:null,place:null,status:null,checked:false}])),reflection:null};}
export function extractionResult(id,run){
 if(!Object.hasOwn(extractionCases,id)||!run||Object.keys(extractionChoices).some(k=>!Object.hasOwn(extractionChoices[k],run[k])))throw new RangeError('台帳の項目が不正です');
 const expected=extractionCases[id].answer;return Object.keys(extractionChoices).filter(k=>run[k]!==expected[k]);
}
export function extractionSet(q,key,value){if(!Object.hasOwn(extractionChoices,key)||!Object.hasOwn(extractionChoices[key],value))throw new RangeError('台帳の項目が不正です');const r=q.runs[q.case];r[key]=value;r.checked=false;}
export function extractionCheck(q){const r=q.runs[q.case];if(Object.keys(extractionChoices).some(k=>r[k]===null))return null;const errors=extractionResult(q.case,r);r.checked=errors.length===0;return errors;}
export function extractionDone(q){return Object.keys(extractionCases).every(k=>q.runs[k].checked&&extractionResult(k,q.runs[k]).length===0)&&q.reflection==='context';}
export function extractionRestore(q){
 if(!q||!Object.hasOwn(extractionCases,q.case)||!q.runs||![null,'context','names','world'].includes(q.reflection))throw new RangeError('記録が不正です');
 const runs={};for(const id of Object.keys(extractionCases)){const r=q.runs[id];if(!r||typeof r.checked!=='boolean'||Object.keys(extractionChoices).some(k=>r[k]!==null&&!Object.hasOwn(extractionChoices[k],r[k])))throw new RangeError('記録が不正です');if(r.checked&&(Object.keys(extractionChoices).some(k=>r[k]===null)||extractionResult(id,r).length))throw new RangeError('記録が不正です');runs[id]={actor:r.actor,place:r.place,status:r.status,checked:r.checked};}return {case:q.case,runs,reflection:q.reflection};
}
