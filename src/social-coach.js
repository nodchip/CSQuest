export const socialCoachLevel={id:'village-social-coach',number:'1276',kind:'social-coach',name:'灯りを学ぶ仲間',tag:'社会的支援ロボット',title:'人形はどう手伝う？',story:'村の学び場で人形が灯りの絵合わせを手伝います。相手に聞き、その人の希望に合う案内を選びましょう。'};
export const socialScenes=[
 {person:'旅人ミナ',setting:'新しい絵合わせに取り組みます。',reply:'「図を見ながら、自分で考えたいな。」',correct:'picture',explanation:'図による手がかりを出し、答えを代わりに選ばず待ちます。'},
 {person:'薬師ロウ',setting:'別の人が絵合わせを始めます。',reply:'「声で一つずつ説明してくれる？」',correct:'voice',explanation:'本人が希望した声の案内を選びます。'},
 {person:'旅人ミナ',setting:'後日、同じ人が学び場を訪れます。',reply:'「今日は休みたい。また今度ね。」',correct:'stop',explanation:'以前の希望を続けず、今回は休む意向を尊重します。'}
];
export const socialActions={picture:'図の手がかりを出す',voice:'声で一つずつ案内する',stop:'休んで終える'};
export function socialCoachCreate(){return {index:0,asked:false,reflection:null};}
export function socialCoachAsk(q){if(q.index>=socialScenes.length)return false;q.asked=true;return true;}
export function socialCoachChoose(q,action){if(q.index>=socialScenes.length||!q.asked||!Object.hasOwn(socialActions,action))return null;const scene=socialScenes[q.index];if(action!==scene.correct)return {ok:false};q.index++;q.asked=false;return {ok:true,explanation:scene.explanation};}
export function socialCoachDone(q){return q.index===socialScenes.length&&q.reflection==='choice';}
export function socialCoachRestore(q){if(!q||!Number.isInteger(q.index)||q.index<0||q.index>socialScenes.length||typeof q.asked!=='boolean'||q.index===socialScenes.length&&q.asked||![null,'choice','assume'].includes(q.reflection))throw new RangeError('記録が不正です。');return {index:q.index,asked:q.asked,reflection:q.reflection};}
