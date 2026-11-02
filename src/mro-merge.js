export const mroLevel={id:'workshop-mro-merge',number:'778',kind:'mro-merge',name:'二つの紋章と一つの根',tag:'多重継承と探索順序',title:'二つの系譜の順序を整えよう',story:'精霊の守り手は二つの系譜を受け継ぎます。それぞれの順序を守り、技を探す道筋を組み立てましょう。'};
export const mroNames={F:'炎',W:'風',R:'根',X:'炎風',Y:'風炎'};
export const mroCases={
 fire:{name:'炎を先に継ぐ',rows:[['F','R'],['W','R'],['F','W']]},
 wind:{name:'風を先に継ぐ',rows:[['W','R'],['F','R'],['W','F']]},
 conflict:{name:'相反する系譜',rows:[['X','F','W','R'],['Y','W','F','R'],['X','Y']]}
};
export function mroInitial(id){if(!Object.hasOwn(mroCases,id))throw new RangeError('未知の系譜です');return {rows:mroCases[id].rows.map(x=>[...x]),order:[],finished:false,conflict:false};}
export function mroNext(state){
 const rows=state.rows.filter(x=>x.length);if(!rows.length)return 'finish';
 return rows.map(x=>x[0]).find(x=>rows.every(row=>!row.slice(1).includes(x)))??'conflict';
}
export function mroStep(state,choice){
 if(state.finished||choice!==mroNext(state))throw new RangeError('この候補はまだ選べません');
 if(choice==='finish'||choice==='conflict'){state.finished=true;state.conflict=choice==='conflict';return state;}
 state.order.push(choice);for(const row of state.rows)if(row[0]===choice)row.shift();return state;
}
export function mroReplay(id,history){if(!Array.isArray(history)||history.length>7)throw new RangeError('記録が不正です');const state=mroInitial(id);for(const step of history)mroStep(state,step);return state;}
export function mroCreate(){return {selected:'fire',trials:Object.fromEntries(Object.keys(mroCases).map(k=>[k,{history:[],prediction:null,checked:false}])),answer:null};}
export function mroTry(q,choice){const t=q.trials[q.selected],state=mroReplay(q.selected,t.history);mroStep(state,choice);t.history.push(choice);t.checked=false;}
export function mroCheck(q){const t=q.trials[q.selected],r=mroReplay(q.selected,t.history);const expected=r.conflict?'conflict':r.order[0];if(!r.finished||t.prediction!==expected)return false;t.checked=true;return true;}
export function mroComplete(q){return Object.values(q.trials).every(t=>t.checked)&&q.answer==='order';}
export function mroRestore(q){if(!q||!Object.hasOwn(mroCases,q.selected)||!q.trials||![null,'order','random','once'].includes(q.answer))throw new RangeError('記録が不正です');const out=mroCreate();out.selected=q.selected;out.answer=q.answer;for(const k of Object.keys(mroCases)){const t=q.trials[k];if(!t||![null,'F','W','conflict'].includes(t.prediction)||typeof t.checked!=='boolean')throw new RangeError('記録が不正です');const r=mroReplay(k,t.history);if(t.checked&&(!r.finished||t.prediction!==(r.conflict?'conflict':r.order[0])))throw new RangeError('確認が不正です');out.trials[k]={history:[...t.history],prediction:t.prediction,checked:t.checked};}return out;}
