export const stairRecurrenceLevel={id:'ruin-stair-recurrence',number:'408',kind:'stair-recurrence',name:'一段と二段の階段',tag:'再帰的な数え上げ',title:'階段の道順を数えよう',story:'遺跡の階段を一段か二段ずつ進みます。道順を集め、短い階段の結果から長い階段の数を求めましょう。'};
export const stairPaths=['111','12','21'];
export const stairCounts=[2,3,5,8,13];
export function createStairRecurrence(){return {path:'',found:[],counts:[],choice:null,answers:{split:null,base:null},checked:false};}
export function stairTotal(path){return [...path].reduce((n,c)=>n+Number(c),0);}
export function stairMove(s,step){if(![1,2].includes(step)||stairTotal(s.path)+step>3)return null;return {...s,path:s.path+step,checked:false};}
export function stairRecord(s){if(!stairPaths.includes(s.path)||s.found.includes(s.path))return null;return {...s,found:[...s.found,s.path],path:'',checked:false};}
export function stairCount(s,value){if(s.counts.length>=stairCounts.length||value!==stairCounts[s.counts.length])return null;return {...s,counts:[...s.counts,value],choice:null,checked:false};}
export function stairRecurrenceComplete(s){return s.found.length===3&&s.counts.length===5&&s.answers.split==='last'&&s.answers.base==='empty'&&s.checked;}
export function restoreStairRecurrence(s){if(!s||typeof s.path!=='string'||!/^[12]*$/.test(s.path)||stairTotal(s.path)>3||!Array.isArray(s.found)||s.found.length>3||new Set(s.found).size!==s.found.length||!s.found.every(p=>stairPaths.includes(p))||!Array.isArray(s.counts)||s.counts.length>5||!s.counts.every((v,i)=>v===stairCounts[i])||![null,1,2,3,5,8,13].includes(s.choice)||(s.counts.length===5&&s.choice!==null)||!s.answers||![null,'last','same','overlap'].includes(s.answers.split)||![null,'empty','none','two'].includes(s.answers.base)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {path:s.path,found:[...s.found],counts:[...s.counts],choice:s.choice,answers:{...s.answers},checked:s.checked};}
