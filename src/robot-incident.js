export const robotIncidentLevel={id:'archive-robot-incident',number:'1279',kind:'robot-incident',name:'自動人形の事故を調べる',tag:'自律システムと責任',title:'事故の記録をたどる',story:'鑑定士は自動車の試験中に起きた実際の事故の報告を調べます。複数の証拠をたどり、それぞれの役割を考えましょう。'};
export const incidentEvidence={
 detection:{name:'検知の記録',text:'NTSB によると、システムは衝突の5.6秒前に対象を検知しましたが、歩行者として正しく分類せず、その経路も正しく予測しませんでした。',category:'perception'},
 braking:{name:'制御の記録',text:'報告書は、衝突が避けられない緊急時の被害軽減だけを目的とする自動緊急ブレーキを作動させない設計で、運転者の介入に依存していたと述べています。',category:'control'},
 operator:{name:'運転者の監視',text:'NTSB は、運転者が携帯電話に視線を奪われ、走行環境とシステムの監視を怠ったことを事故の推定原因としました。',category:'monitor'},
 organization:{name:'組織の安全管理',text:'NTSB は試験を行った組織の不十分なリスク評価、運転者の監督、過信に対処する仕組みを、事故に寄与した要因として挙げました。',category:'oversight'}
};
export const incidentCategories={perception:'対象の認識と予測',control:'車両の緊急時の制御',monitor:'運転者による監視',oversight:'組織のリスク評価と監督'};
export function robotIncidentCreate(){return {selected:'detection',opened:[],matched:[],choice:null,reflection:null};}
export function robotIncidentOpen(q,key){if(!Object.hasOwn(incidentEvidence,key))return false;q.selected=key;q.choice=null;if(!q.opened.includes(key))q.opened.push(key);return true;}
export function robotIncidentCheck(q){if(!q.opened.includes(q.selected)||!Object.hasOwn(incidentCategories,q.choice))return null;const ok=incidentEvidence[q.selected].category===q.choice;if(ok&&!q.matched.includes(q.selected))q.matched.push(q.selected);return ok;}
export function robotIncidentDone(q){return Object.keys(incidentEvidence).every(k=>q.matched.includes(k))&&q.reflection==='layers';}
export function robotIncidentRestore(q){if(!q||!Object.hasOwn(incidentEvidence,q.selected)||![null,...Object.keys(incidentCategories)].includes(q.choice)||![null,'layers','single'].includes(q.reflection)||!Array.isArray(q.opened)||!Array.isArray(q.matched)||new Set(q.opened).size!==q.opened.length||new Set(q.matched).size!==q.matched.length||q.opened.some(k=>!Object.hasOwn(incidentEvidence,k))||q.matched.some(k=>!q.opened.includes(k)))throw new RangeError('記録が不正です。');return {selected:q.selected,opened:[...q.opened],matched:[...q.matched],choice:q.choice,reflection:q.reflection};}
