export const schedulerGoalsLevel={id:'forge-scheduler-goals',number:'632',kind:'scheduler-goals',name:'刻限と応答の工房',tag:'スケジューリングの目的',title:'仕事の目的に合う順番を選ぼう',story:'工房には刻限のある封印と、旅人が応答を待つ伝令があります。二つの順番で進めて結果を比べましょう。'};
export const schedulerGoalJobs={A:{name:'封印 A',work:3,deadline:3},B:{name:'伝令 B',work:2,deadline:5}};
export const schedulerGoalPolicies={edf:'期限の早い仕事を優先',round:'１刻ずつ交代'};
export function goalSchedule(policy,history){
 if(!Object.hasOwn(schedulerGoalPolicies,policy)||!Array.isArray(history)||history.length>5)throw new RangeError('方式か履歴が不正です。');
 const s={remaining:{A:3,B:2},first:{A:null,B:null},finished:{A:null,B:null},next:null};let turn='A';
 for(let t=0;t<history.length;t++){const expected=policy==='edf'?(s.remaining.A?'A':'B'):(s.remaining[turn]?turn:turn==='A'?'B':'A');const job=history[t];if(job!==expected)throw new RangeError('方式に合わない履歴です。');if(s.first[job]===null)s.first[job]=t;if(--s.remaining[job]===0)s.finished[job]=t+1;turn=job==='A'?'B':'A';}
 if(history.length<5)s.next=policy==='edf'?(s.remaining.A?'A':'B'):(s.remaining[turn]?turn:turn==='A'?'B':'A');return s;
}
export function createSchedulerGoals(){return {selected:'edf',histories:{edf:[],round:[]},answers:{deadline:null,response:null},reflection:null,checked:false};}
export function schedulerGoalsComplete(s){return Object.keys(schedulerGoalPolicies).every(p=>s.histories[p].length===5)&&s.answers.deadline==='edf'&&s.answers.response==='round'&&s.reflection==='limits'&&s.checked;}
export function restoreSchedulerGoals(s){if(!s||!Object.hasOwn(schedulerGoalPolicies,s.selected)||!s.histories||!s.answers||![null,'edf','round'].includes(s.answers.deadline)||![null,'edf','round'].includes(s.answers.response)||![null,'limits','always','deadline'].includes(s.reflection)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=createSchedulerGoals();r.selected=s.selected;r.answers={...s.answers};r.reflection=s.reflection;r.checked=s.checked;for(const p of Object.keys(schedulerGoalPolicies)){goalSchedule(p,s.histories[p]);r.histories[p]=[...s.histories[p]];}return r;}
