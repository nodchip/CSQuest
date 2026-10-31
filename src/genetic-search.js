export const geneticLevel={id:'forest-genetic-search',number:'374',kind:'genetic-search',name:'星の紋章を育てる',tag:'遺伝的アルゴリズム',title:'紋章を組み合わせて星を灯そう',story:'精霊たちは４つの灯りを持つ紋章を集め、星を多く灯す組合せを探します。親の紋章を交ぜ、変化させ、良い紋章を残しましょう。'};
export const oldPopulation=['1111','1100','0011','0000'];
export const parents=['1100','0011'];
export const fitness=bits=>[...bits].filter(x=>x==='1').length;
export function crossover(cut){if(![1,2,3].includes(cut))throw new RangeError('切れ目が不正です');return [parents[0].slice(0,cut)+parents[1].slice(cut),parents[1].slice(0,cut)+parents[0].slice(cut)];}
export function mutate(bits,index){if(!/^[01]{4}$/.test(bits)||![0,1,2,3].includes(index))throw new RangeError('突然変異が不正です');return [...bits].map((b,i)=>i===index?(b==='1'?'0':'1'):b).join('');}
export function nextGeneration(cut,index,elite){if(typeof elite!=='boolean')throw new RangeError('保存設定が不正です');const [first,second]=crossover(cut),mutated=mutate(first,index);return [mutated,second,'0000',elite?oldPopulation[0]:'0000'];}
export function createGenetic(){return {cut:2,bit:0,elite:false,seen:{without:false,with:false},answer:null,checked:false};}
export function geneticComplete(s){return s.seen.without&&s.seen.with&&s.answer==='balance'&&s.checked;}
export function restoreGenetic(s){if(!s||![1,2,3].includes(s.cut)||![0,1,2,3].includes(s.bit)||typeof s.elite!=='boolean'||!s.seen||typeof s.seen.without!=='boolean'||typeof s.seen.with!=='boolean'||![null,'balance','guarantee','mutationGood'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {cut:s.cut,bit:s.bit,elite:s.elite,seen:{...s.seen},answer:s.answer,checked:s.checked};}
