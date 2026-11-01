export const recursiveCargoLevel={id:'village-recursive-cargo',number:'597',kind:'recursive-cargo',name:'入れ子の手紙をほどく',tag:'再帰型と場合分け',title:'石と残りの箱をつなごう',story:'薬師へ届ける石の列を、空の箱と、石を一つ付けた箱だけで作ります。届いた箱を先頭から開き、最後まで確かめましょう。'};
export const recursiveStones={moon:'月',star:'星'};
export const recursiveCases={short:{name:'月 → 星',target:['moon','star']},long:{name:'星 → 月 → 星',target:['star','moon','star']}};
const fresh=()=>({items:[],phase:'build',cursor:0});
export function createRecursiveCargo(){return {selected:'short',trials:{short:fresh(),long:fresh()},answer:null,checked:false,message:'空の箱から作りましょう。'};}
export function prependRecursive(t,stone){if(!Object.hasOwn(recursiveStones,stone)||t.phase!=='build')throw new RangeError('追加できません。');if(t.items.length>=3)return {trial:t,message:'この試練では３個までです。やり直して別の列を作れます。'};return {trial:{...t,items:[stone,...t.items]},message:`${recursiveStones[stone]}を先頭に付けました。`};}
export function startRecursive(id,t){if(!Object.hasOwn(recursiveCases,id)||t.phase!=='build')throw new RangeError('開始できません。');if(JSON.stringify(t.items)!==JSON.stringify(recursiveCases[id].target))return {trial:t,message:'依頼の順序と箱の先頭からの順序を比べましょう。'};return {trial:{...t,phase:'walk',cursor:0},message:'先頭の箱の種類を選びましょう。'};}
export function stepRecursive(t,choice){if(t.phase!=='walk'||!['empty','cons'].includes(choice))throw new RangeError('箱を開けません。');const actual=t.cursor===t.items.length?'empty':'cons';if(choice!==actual)return {trial:t,message:actual==='empty'?'残りは空の箱です。':'まだ石と残りの箱があります。'};if(actual==='empty')return {trial:{...t,phase:'done'},message:'空の箱に到着し、読み終えました。'};return {trial:{...t,cursor:t.cursor+1},message:`先頭の${recursiveStones[t.items[t.cursor]]}を取り出し、残りの箱に進みました。`};}
export function recursiveCargoComplete(s){return Object.keys(recursiveCases).every(id=>s.trials[id].phase==='done')&&s.answer==='recursive'&&s.checked;}
export function restoreRecursiveCargo(saved){
 if(!saved||!Object.hasOwn(recursiveCases,saved.selected)||!saved.trials||![null,'recursive','noend','pair'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const s=createRecursiveCargo();s.selected=saved.selected;s.answer=saved.answer;s.checked=saved.checked;
 for(const id of Object.keys(recursiveCases)){const t=saved.trials[id];if(!t||!Array.isArray(t.items)||t.items.length>3||t.items.some(x=>!Object.hasOwn(recursiveStones,x))||!['build','walk','done'].includes(t.phase)||!Number.isInteger(t.cursor)||t.cursor<0||t.cursor>t.items.length||(t.phase==='build'&&t.cursor!==0)||(t.phase!=='build'&&JSON.stringify(t.items)!==JSON.stringify(recursiveCases[id].target))||(t.phase==='done'&&t.cursor!==t.items.length))throw new RangeError('試練の記録が不正です。');s.trials[id]={items:[...t.items],phase:t.phase,cursor:t.cursor};}
 return s;
}
