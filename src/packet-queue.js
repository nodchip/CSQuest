export const packetQueueLevel={id:'forest-packet-queue',number:'271',kind:'packet-queue',name:'橋を待つ三通の伝令',tag:'パケットと待ち行列',title:'混み合う橋を渡そう',story:'森の中継塔は、一刻に一通だけ橋へ送れます。'};
export const packetQueueModes={burst:'３通を同時に到着',spaced:'１通ずつ到着'};
export function packetQueueTrace(mode,ticks){
 if(!Object.hasOwn(packetQueueModes,mode)||!Number.isInteger(ticks)||ticks<0||ticks>3)throw new RangeError('条件が不正です。');
 const arrivals=mode==='burst'?[['Ａ','Ｂ','Ｃ'],[],[]]:[['Ａ'],['Ｂ'],['Ｃ']];let queue=[],delivered=[],dropped=[];const events=[];
 for(let t=0;t<ticks;t++){const accepted=[],lost=[];for(const name of arrivals[t]){if(queue.length<2){queue.push(name);accepted.push(name);}else{dropped.push(name);lost.push(name);}}const sent=queue.shift()??null;if(sent)delivered.push(sent);events.push({time:t,arrivals:[...arrivals[t]],accepted,lost,sent,waiting:[...queue]});}
 return {events,queue,delivered,dropped};
}
export function createPacketQueue(){return {mode:'burst',ticks:{burst:0,spaced:0},answer:null,checked:false};}
export function packetQueueComplete(s){return s.ticks.burst===3&&s.ticks.spaced===3&&s.answer==='spaced'&&s.checked;}
export function restorePacketQueue(saved){if(!saved||!Object.hasOwn(packetQueueModes,saved.mode)||!saved.ticks||!Object.keys(packetQueueModes).every(m=>Number.isInteger(saved.ticks[m])&&saved.ticks[m]>=0&&saved.ticks[m]<=3)||![null,'burst','spaced'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {mode:saved.mode,ticks:{burst:saved.ticks.burst,spaced:saved.ticks.spaced},answer:saved.answer,checked:saved.checked};}
