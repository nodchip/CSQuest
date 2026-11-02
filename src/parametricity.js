export const parametricityLevel={id:'workshop-parametricity',number:'770',kind:'parametricity',name:'姿を変えても同じ道',tag:'パラメトリシティ',title:'型から道具の約束を探そう',story:'工房には２つの石から１つを返す道具があります。石の姿を変える前後で道具を使い、見た目に頼らない約束を調べましょう。'};
export const paramSource={moon:'月',star:'星'};
export const paramTarget={red:'赤',blue:'青',green:'緑'};
export const paramMachines={first:'いつも左を返す',second:'いつも右を返す',typecase:'種類によって左か右を変える',constant:'種類ごとに決まった石を返す'};
export const paramFlags=['firstSame','secondSame','typeSame','typeDifferent','constantSame','constantDifferent'];
export const paramProof=[
 {question:'左と右が異なる２種類の印を持つ世界で、２つから１つを返す道具の結果は？',choices:['左か右のどちらか','必ず第三の印','結果は存在しなくてもよい'],answer:0,why:'この世界には２種類しかなく、道具は必ず１つを返すと仮定しています。'},
 {question:'任意の世界の２つの品を考えるには、２つの印をどう対応させますか。',choices:['左の印を左の品、右の印を右の品に写す','どちらの印も常に同じ固定の品へ写す','写すことはできない'],answer:0,why:'任意の品 x・y に対し、２種類の印をそれぞれ x・y に写す関数を考えられます。x と y は同じでも構いません。'},
 {question:'すべての写し方について、道具の前後で写す順序が交換できるなら、任意の世界での結果は？',choices:['２種類の印の世界で選んだ側と、常に同じ側','型を見て左右を切り替えてもよい','型だけではどちらの品か一切分からない'],answer:0,why:'２種類の世界で返した側を任意の x・y に写すと、任意の世界でも同じ側になります。'}
];
export function paramCreate(){return {machine:'first',left:'moon',right:'star',map:{moon:'red',star:'blue'},guess:null,flags:[],answers:[null,null,null],checked:false};}
export function paramResult(s){
 if(!Object.hasOwn(paramMachines,s.machine)||!Object.hasOwn(paramSource,s.left)||!Object.hasOwn(paramSource,s.right)||!s.map||!Object.keys(paramSource).every(x=>Object.hasOwn(paramTarget,s.map[x])))throw new RangeError('変換の条件が不正です。');
 const source=s.machine==='second'?s.right:s.machine==='constant'?'moon':s.left;
 const mapped=[s.map[s.left],s.map[s.right]];
 const target=s.machine==='second'||s.machine==='typecase'?mapped[1]:s.machine==='constant'?'red':mapped[0];
 return {source,mapped,after:s.map[source],before:target,same:s.map[source]===target};
}
export function paramTry(s){const r=paramResult(s);if(typeof s.guess!=='boolean')return {ok:false,...r,message:'二つの道の結果が同じか予想しましょう。'};if(s.guess!==r.same)return {ok:false,...r,message:'左の道具の結果を写したものと、先に写してから道具を使った結果を比べましょう。'};const flag=s.machine==='first'?'firstSame':s.machine==='second'?'secondSame':`${s.machine==='typecase'?'type':'constant'}${r.same?'Same':'Different'}`;if(!s.flags.includes(flag))s.flags.push(flag);return {ok:true,...r,message:r.same?'予想どおり、二つの道の結果は同じです。':'予想どおり、二つの道の結果は異なります。これは一様性が破れる反例です。'};}
export function paramComplete(s){return paramFlags.every(f=>s.flags.includes(f))&&paramProof.every((p,i)=>s.answers[i]===p.answer)&&s.checked;}
export function paramRestore(s){if(!s||![null,true,false].includes(s.guess)||!Array.isArray(s.flags)||new Set(s.flags).size!==s.flags.length||s.flags.some(f=>!paramFlags.includes(f))||!Array.isArray(s.answers)||s.answers.length!==paramProof.length||s.answers.some(v=>![null,0,1,2].includes(v))||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');paramResult(s);return {...paramCreate(),machine:s.machine,left:s.left,right:s.right,map:{moon:s.map.moon,star:s.map.star},guess:s.guess,flags:[...s.flags],answers:[...s.answers],checked:s.checked};}
