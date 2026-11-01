export const kmpRunesLevel={id:'archive-kmp-runes',number:'714',kind:'kmp-runes',name:'重なるルーンを探す',tag:'KMP 文字列照合',title:'巻物に隠れた合図',story:'古い巻物に刻まれた合図を見つけます。一致した部分を活かし、巻物を戻さずに調べましょう。'};
export const kmpCases={overlap:{name:'重なる合図',text:'ABABAB',pattern:'ABAB'},fallback:{name:'繰り返す文字',text:'AABAAAAB',pattern:'AAAB'}};
export function kmpPrefix(pattern){if(typeof pattern!=='string'||!pattern.length)throw new RangeError('空の合図は扱いません。');const pi=Array(pattern.length).fill(0);for(let i=1,j=0;i<pattern.length;i++){while(j>0&&pattern[i]!==pattern[j])j=pi[j-1];if(pattern[i]===pattern[j])j++;pi[i]=j;}return pi;}
export function kmpStart(id){if(!Object.hasOwn(kmpCases,id))throw new RangeError('未知の巻物です。');return {id,phase:'prefix',prefixIndex:0,i:0,j:0,matches:[],comparisons:0,history:[],message:'合図の先頭と末尾が重なる、最長の長さを選びましょう。全体と同じ長さは除きます。'};}
export function kmpStep(s,action){
 const {text,pattern}=kmpCases[s.id],pi=kmpPrefix(pattern);if(s.phase==='done')throw new RangeError('巻物は調査済みです。');
 if(s.phase==='prefix'){if(action!==pi[s.prefixIndex])return {...s,message:'その部分の先頭と末尾をもう一度比べましょう。全体そのものは除きます。'};const prefixIndex=s.prefixIndex+1;return {...s,prefixIndex,phase:prefixIndex===pattern.length?'search':'prefix',history:[...s.history,action],message:prefixIndex===pattern.length?'表ができました。巻物と合図の文字を比べましょう。':'次の部分について、最長の重なりを選びましょう。'};}
 const expected=text[s.i]===pattern[s.j]?'match':s.j>0?'fallback':'skip';
 const isFallback=expected==='fallback'&&action===`fallback:${pi[s.j-1]}`;
 if(action!==expected&&!isFallback)return {...s,message:s.j>0?'不一致なら、一致済みの部分に対応する表の値を選びます。一致なら両方進みます。':'先頭で不一致なら巻物を１文字進めます。'};
 if(action==='fallback')return {...s,message:'一致済みの部分に対応する表の値を選びましょう。'};
 let {i,j,matches}=s;let message;
 if(action==='match'){i++;j++;message='一致しました。両方を１文字進めます。';if(j===pattern.length){matches=[...matches,i-pattern.length];j=pi[j-1];message='合図を発見。重なる合図も調べるため、表の長さまで戻します。';}}
 else if(isFallback){j=pi[j-1];message=`一致済み部分の表の値 ${j} を使い、巻物は戻さず合図の位置を戻しました。`;}
 else{i++;message='先頭でも不一致なので巻物を１文字進めました。';}
 const phase=i===text.length?'done':'search';return {...s,i,j,matches,phase,comparisons:s.comparisons+1,history:[...s.history,action],message:phase==='done'?`巻物を最後まで調べました。見つかった場所は ${matches.length?matches.map(x=>x+1).join('、')+' 文字目':'ありません'}。`:message};
}
export function kmpCreate(){return {selected:'overlap',states:{overlap:kmpStart('overlap'),fallback:kmpStart('fallback')}};}
export function kmpRestore(saved){if(!saved||!Object.hasOwn(kmpCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const out=kmpCreate();out.selected=saved.selected;for(const id of Object.keys(kmpCases)){const h=saved.history[id];if(!Array.isArray(h)||h.length>60)throw new RangeError('途中記録が不正です。');let s=kmpStart(id);for(const oldAction of h){const action=oldAction==='fallback'&&s.phase==='search'&&s.j>0?`fallback:${kmpPrefix(kmpCases[id].pattern)[s.j-1]}`:oldAction;const next=kmpStep(s,action);if(next.history.length!==s.history.length+1)throw new RangeError('途中記録が不正です。');s=next;}out.states[id]=s;}return out;}
export function kmpComplete(q){return Object.values(q.states).every(s=>s.phase==='done');}
