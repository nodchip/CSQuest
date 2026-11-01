import {createSignalLab,signalLabComplete,restoreSignalLab} from './process-signal-lab.js';
export const processForkLevel={id:'forge-process-fork',number:'386',kind:'process-fork',name:'親子の精霊と一冊の巻物',tag:'プロセス生成・実行・終了',title:'親子の仕事を追いかけよう',story:'親の精霊は巻物を開いたまま子を作り、別の仕事を頼みます。手元の記録と巻物の読取り位置、子の終了を調べましょう。'};
export const forkActions={fork:'子を作る',childWrite:'子の手元を「星」に変える',parentInspect:'親の手元を調べる',childRead:'子が２バイト読む',parentRead:'親が２バイト読む',exec:'子が別の仕事に切り替える',wait:'親が子の状態を待たずに確認',exit:'子が終了する'};
export function createProcessFork(){return {child:'none',program:null,parentNote:'月',childNote:null,offset:0,marks:{fork:false,childWrite:false,parentInspect:false,childRead:false,parentRead:false,exec:false,waitRunning:false,exit:false,reaped:false},history:[],last:null,answers:{memory:null,lifecycle:null},checked:false,signals:createSignalLab()};}
export function processForkStep(s,action){if(!Object.hasOwn(forkActions,action))throw new RangeError('操作が不正です');if(s.history.length>=60)return null;const n={...s,marks:{...s.marks},history:[...s.history,action],checked:false};const live=s.child==='running';n.last={type:'unavailable'};
 if(action==='fork'&&s.child==='none'){n.child='running';n.program='scribe';n.childNote=s.parentNote;n.marks.fork=true;n.last={type:'fork'};}
 else if(action==='childWrite'&&live&&s.program==='scribe'){n.childNote='星';n.marks.childWrite=true;n.last={type:'write'};}
 else if(action==='parentInspect'&&s.child!=='none'){if(s.marks.childWrite)n.marks.parentInspect=true;n.last={type:'inspect',value:s.parentNote};}
 else if(action==='exec'&&live&&s.program==='scribe'){n.program='lantern';n.childNote=null;n.marks.exec=true;n.last={type:'exec'};}
 else if(action==='wait'&&s.child==='running'){n.marks.waitRunning=true;n.last={type:'running'};}
 else if(action==='exit'&&live){n.child='zombie';n.program=null;n.childNote=null;n.marks.exit=true;n.last={type:'exit'};}
 else if(action==='wait'&&s.child==='zombie'){n.child='reaped';n.marks.reaped=true;n.last={type:'reaped'};}
 else if((action==='childRead'&&live)||(action==='parentRead'&&s.child!=='none')){const text='ABC'.slice(s.offset,s.offset+2);n.offset+=text.length;n.last={type:'read',who:action==='childRead'?'子':'親',text,count:text.length};if(action==='childRead'&&text==='AB')n.marks.childRead=true;if(action==='parentRead'&&text==='C'&&s.marks.childRead)n.marks.parentRead=true;}
 return n;}
export function processForkComplete(s){return Object.values(s.marks).every(Boolean)&&s.answers.memory==='private'&&s.answers.lifecycle==='replace'&&s.checked&&signalLabComplete(s.signals);}
export function restoreProcessFork(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>60||!saved.answers||![null,'private','allShared'].includes(saved.answers.memory)||![null,'replace','new'].includes(saved.answers.lifecycle)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です');let s=createProcessFork();for(const action of saved.history){s=processForkStep(s,action);if(!s)throw new RangeError('途中記録が不正です');}s.answers={memory:saved.answers.memory,lifecycle:saved.answers.lifecycle};s.checked=saved.checked;if(saved.signals!==undefined)s.signals=restoreSignalLab(saved.signals);return s;}
