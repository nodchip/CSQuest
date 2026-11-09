// Fixed fictional interviews. A statement is not yet an agreed specification.
export const interviewCards=[
 {id:'size',text:'文字を大きくできると助かります。',group:'function'},
 {id:'fast',text:'掲示を早く見たいです。',group:'question'},
 {id:'find',text:'行き先から乗り場を探したいです。',group:'function'},
 {id:'time',text:'表示は２秒以内がよいです。',group:'condition'},
 {id:'private',text:'予約を誰が見られるのか気になります。',group:'question'},
 {id:'keyboard',text:'マウスなしでも操作できるようにしたいです。',group:'condition'}
];
export const stories=[
 {speaker:'初めて訪れた旅人',need:'行き先から乗り場を探す',reason:'乗り場を見つける',options:{speaker:['案内係','初めて訪れた旅人'],need:['行き先から乗り場を探す','予約を消す'],reason:['荷物の重さを量る','乗り場を見つける']}},
 {speaker:'案内係',need:'掲示する時刻を直す',reason:'変更を旅人に知らせる',options:{speaker:['案内係','初めて訪れた旅人'],need:['行き先から乗り場を探す','掲示する時刻を直す'],reason:['変更を旅人に知らせる','荷物の重さを量る']}}
];
export const accessCases=[
 {record:'時刻表',viewer:'ミナ',allowed:true},
 {record:'ミナの予約',viewer:'レン',allowed:false},
 {record:'ミナの予約',viewer:'ミナ',allowed:true},
 {record:'レンの予約',viewer:'ミナ',allowed:false},
 {record:'時刻表',viewer:'レン',allowed:true},
 {record:'レンの予約',viewer:'レン',allowed:true}
];
export function replayRequirements(kind,history){
 if(!['interview','story','agreement'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,placed={},speaker=null,need=null,reason=null,questions=[],choice=null;const results=[];
 for(const action of history){
  if(typeof action!=='string')return null;
  if(kind==='interview'){
   if(scene>0)return null;
   if(action==='check'){
    if(interviewCards.some(c=>placed[c.id]!==c.group))return null;results.push({...placed});scene=1;
   }else{const m=/^place:([a-z]+):(function|condition|question)$/.exec(action);if(!m||!interviewCards.some(c=>c.id===m[1]))return null;placed[m[1]]=m[2];}
  }else if(kind==='story'){
   const task=stories[scene];if(!task)return null;
   if(action==='check'){
    if(speaker!==task.speaker||need!==task.need||reason!==task.reason)return null;
    results.push({speaker,need,reason});scene++;speaker=null;need=null;reason=null;
   }else{const m=/^(speaker|need|reason):(\d+)$/.exec(action),field=m?.[1],i=m?Number(m[2]):-1;if(!m||!task.options[field]?.[i])return null;if(field==='speaker')speaker=task.options[field][i];else if(field==='need')need=task.options[field][i];else reason=task.options[field][i];}
  }else{
   if(scene===0){
    if(action==='question:records'||action==='question:viewers'){const q=action.slice(9);if(questions.includes(q))return null;questions.push(q);}
    else if(action==='check'&&questions.includes('records')&&questions.includes('viewers')){scene=1;}
    else return null;
   }else{
    const task=accessCases[scene-1];if(!task)return null;
    if(action==='choose:allow'||action==='choose:deny')choice=action==='choose:allow';
    else if(action==='check'&&choice===task.allowed){results.push({record:task.record,viewer:task.viewer,allowed:choice});scene++;choice=null;}
    else return null;
   }
  }
 }
 return {scene,placed,speaker,need,reason,questions,choice,results,done:kind==='interview'?scene===1:kind==='story'?scene===stories.length:scene===accessCases.length+1};
}
