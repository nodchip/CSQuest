export const huffmanLevel={id:'archive-huffman',number:'110',kind:'huffman',name:'短い印の伝言木',tag:'ハフマン符号と貪欲法',title:'伝言の印を短くしよう',story:'書庫の伝言には４種類の印があります。よく使う印に短い道を与え、伝言を少ない光で届けましょう。'};
export const huffmanWeights={A:5,B:2,C:2,D:1};
export function createHuffman(){return {pool:Object.entries(huffmanWeights).map(([symbol,weight])=>({id:symbol,symbol,weight})),selected:[],history:[],message:'回数の小さい２つの札を選びましょう。'};}
export function toggleHuffman(state,id){if(state.pool.length<=1||!state.pool.some(node=>node.id===id))throw new RangeError('札を選べません。');if(state.selected.includes(id))return {...state,selected:state.selected.filter(x=>x!==id)};if(state.selected.length===2)return {...state,message:'２つ選んでいます。選び直すには札を外してください。'};return {...state,selected:[...state.selected,id]};}
export function mergeHuffman(state){
 if(state.pool.length<=1)throw new RangeError('木は完成しています。');if(state.selected.length!==2)return {...state,message:'結ぶ札を２つ選びましょう。'};
 const [left,right]=state.selected.map(id=>state.pool.find(node=>node.id===id)),lowest=state.pool.map(node=>node.weight).sort((a,b)=>a-b).slice(0,2),chosen=[left.weight,right.weight].sort((a,b)=>a-b);
 if(chosen.some((weight,i)=>weight!==lowest[i]))return {...state,message:'残っている札のうち、回数が小さい２つを選びましょう。同じ回数ならどちらでも構いません。'};
 const node={id:`N${state.history.length}`,symbol:null,weight:left.weight+right.weight,left,right},pool=state.pool.filter(n=>!state.selected.includes(n.id));pool.push(node);
 return {pool,selected:[],history:[...state.history,[left.id,right.id]],message:pool.length===1?'伝言の木が完成しました。':`回数 ${left.weight} と ${right.weight} を結び、${node.weight} の札にしました。`};
}
export function huffmanCodes(state){if(state.pool.length!==1)throw new RangeError('木が完成していません。');const result={};function walk(node,prefix){if(node.symbol)result[node.symbol]=prefix;else{walk(node.left,prefix+'0');walk(node.right,prefix+'1');}}walk(state.pool[0],'');return result;}
export function huffmanCost(state){const codes=huffmanCodes(state);return Object.entries(huffmanWeights).reduce((sum,[symbol,weight])=>sum+weight*codes[symbol].length,0);}
export function restoreHuffman(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>3||!Array.isArray(saved.selected)||saved.selected.length>2||new Set(saved.selected).size!==saved.selected.length)throw new RangeError('途中記録が不正です。');let state=createHuffman();for(const pair of saved.history){if(!Array.isArray(pair)||pair.length!==2||pair[0]===pair[1])throw new RangeError('途中記録が不正です。');for(const id of pair)state=toggleHuffman(state,id);const next=mergeHuffman(state);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}for(const id of saved.selected)state=toggleHuffman(state,id);return state;}
