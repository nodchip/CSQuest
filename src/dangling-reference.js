export const danglingLevel={id:'workshop-dangling-reference',number:'203',kind:'dangling-reference',name:'二つの札と消えた箱',tag:'別名と解放後の参照',title:'箱を指す札を確かめよう',story:'精霊は同じ箱を指す二枚の札を使っています。箱を片付けた後、残った札が何を指すか確かめましょう。'};
export const danglingCases={dangling:{name:'札を残す',clear:false},cleared:{name:'先に札を外す',clear:true}};
export const danglingAnswers={live:'使える箱を指す',dangling:'解放済みの箱を指す',empty:'何も指さない'};
export function createDanglingTrial(id){if(!Object.hasOwn(danglingCases,id))throw new RangeError('試行が不正です。');return {id,phase:'prepare',q:'A',alive:true,choice:'live',history:[],message:'P と Q は同じ箱 A を指しています。'};}
export function danglingStep(s,action){if(s.phase==='done')return {...s,message:'この試行は終わっています。'};const n={...s,history:s.history.slice()};
 if(s.phase==='prepare'&&action==='keep'&&!danglingCases[s.id].clear){n.phase='free';n.message='Q は A を指したままです。P から箱を解放しましょう。';}
 else if(s.phase==='prepare'&&action==='clear'&&danglingCases[s.id].clear){n.q=null;n.phase='free';n.message='Q の参照を外しました。箱 A はまだ使えます。';}
 else if(s.phase==='free'&&action==='free'){n.alive=false;n.phase='predict';n.message='箱 A を解放しました。Q の状態を選びましょう。';}
 else if(s.phase==='predict'&&Object.hasOwn(danglingAnswers,action)){const answer=s.q===null?'empty':'dangling';if(action!==answer)return {...s,message:'Q 自体を変えたか、箱がまだ存在するかを別々に確認しましょう。'};n.phase='done';n.choice=action;n.message=answer==='empty'?'Q は何も指しません。':'Q は解放済みの箱を指す、ダングリング参照です。';}
 else return {...s,message:s.phase==='prepare'?'この試行の指示に合う札の操作を選びましょう。':s.phase==='free'?'P から箱を解放しましょう。':'Q の状態を選びましょう。'};n.history.push(action);return n;}
export function createDanglingSet(){return {selected:'dangling',trials:{dangling:createDanglingTrial('dangling'),cleared:createDanglingTrial('cleared')}};}
export function restoreDanglingSet(saved){if(!saved||!Object.hasOwn(danglingCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createDanglingSet();s.selected=saved.selected;for(const id of Object.keys(danglingCases)){const history=saved.histories[id];if(!Array.isArray(history)||history.length>3)throw new RangeError('途中記録が不正です。');for(const action of history){const n=danglingStep(s.trials[id],action);if(n.history.length!==s.trials[id].history.length+1)throw new RangeError('途中記録が不正です。');s.trials[id]=n;}}return s;}
export function danglingComplete(s){return Object.keys(danglingCases).every(id=>s.trials[id].phase==='done');}
