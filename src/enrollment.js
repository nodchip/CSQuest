export const enrollmentLevel={id:'guild-enrollment',number:'101',kind:'enrollment',name:'ギルドの依頼受付',tag:'多対多のデータモデル',title:'受付台帳を組み立てる',story:'一人の冒険者は複数の依頼を受け、同じ依頼には複数人が参加します。受付の関係を残せる台帳を選びましょう。'};
export const enrollmentModels={person:{name:'冒険者ごとに依頼を１つ記録',key:'person'},quest:{name:'依頼ごとに冒険者を１人記録',key:'quest'},pair:{name:'参加ごとに冒険者と依頼の組を記録',key:'pair'}};
export const enrollmentRequests=[{person:'アオ',quest:'森'},{person:'アオ',quest:'塔'},{person:'ミナ',quest:'森'},{person:'アオ',quest:'森'},{person:'アオ',quest:'海'}];
export const validPersons=['アオ','ミナ'];export const validQuests=['森','塔'];
export function createEnrollmentTrial(id){if(!Object.hasOwn(enrollmentModels,id))throw new RangeError('台帳が不正です。');return {id,index:0,rows:[],results:[],message:'受付に来た順に記録しましょう。'};}
export function enrollmentStep(state){
 if(state.index>=enrollmentRequests.length)throw new RangeError('受付は終了しています。');const request=enrollmentRequests[state.index],model=enrollmentModels[state.id];let reason='';
 if(!validPersons.includes(request.person)||!validQuests.includes(request.quest))reason='存在しない冒険者または依頼です。';
 else if(state.rows.some(row=>row.person===request.person&&row.quest===request.quest))reason='同じ参加の組が既にあります。';
 else if(model.key==='person'&&state.rows.some(row=>row.person===request.person))reason='冒険者に記録できる依頼は１つだけです。';
 else if(model.key==='quest'&&state.rows.some(row=>row.quest===request.quest))reason='依頼に記録できる冒険者は１人だけです。';
 const accepted=!reason,rows=accepted?[...state.rows,{...request}]:state.rows.slice(),results=[...state.results,{...request,accepted,reason}];return {...state,index:state.index+1,rows,results,message:accepted?'参加を記録しました。':reason};
}
export function createEnrollment(){return {selected:'person',states:Object.fromEntries(Object.keys(enrollmentModels).map(id=>[id,createEnrollmentTrial(id)]))};}
export function restoreEnrollment(saved){if(!saved||!Object.hasOwn(enrollmentModels,saved.selected)||!saved.steps)throw new RangeError('途中記録が不正です。');const result=createEnrollment();result.selected=saved.selected;for(const id of Object.keys(enrollmentModels)){const n=saved.steps[id];if(!Number.isInteger(n)||n<0||n>enrollmentRequests.length)throw new RangeError('途中記録が不正です。');for(let i=0;i<n;i++)result.states[id]=enrollmentStep(result.states[id]);}return result;}
export function enrollmentComplete(set){return Object.values(set.states).every(state=>state.index===enrollmentRequests.length);}
