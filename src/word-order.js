export const wordOrderLevel={id:'archive-word-order',number:'121',kind:'wordorder',name:'竜と騎士の伝言',tag:'単語の袋と N グラム',title:'伝言の主役を見つける',story:'竜と騎士から似た伝言が届きました。単語の数と並びを調べ、誰が助ける側なのか確かめましょう。'};
export const messages={a:['竜','が','騎士','を','助ける'],b:['騎士','が','竜','を','助ける']};
export const pairs={'dragon':'竜・が','knight':'騎士・が','help':'を・助ける'};
export function bag(tokens){return tokens.reduce((out,token)=>(out[token]=(out[token]||0)+1,out),{});}
export function bigrams(tokens){return tokens.slice(1).map((token,i)=>`${tokens[i]}・${token}`);}
export function pairPresent(message,pair){if(!Object.hasOwn(messages,message)||!Object.hasOwn(pairs,pair))throw new RangeError('伝言または組が不正です。');return bigrams(messages[message]).includes(pairs[pair]);}
export function createWordOrder(){return {bag:'',bigram:'',pairA:'',pairB:'',actorA:'',actorB:'',checked:false};}
export function restoreWordOrder(s){if(!s||!['','same','different'].includes(s.bag)||!['','same','different'].includes(s.bigram)||!['',...Object.keys(pairs)].includes(s.pairA)||!['',...Object.keys(pairs)].includes(s.pairB)||!['','dragon','knight'].includes(s.actorA)||!['','dragon','knight'].includes(s.actorB)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s};}
export function wordOrderComplete(s){return s.checked&&s.bag==='same'&&s.bigram==='different'&&s.pairA==='dragon'&&s.pairB==='knight'&&s.actorA==='dragon'&&s.actorB==='knight';}
