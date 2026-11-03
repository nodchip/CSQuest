export const busTopologyLevel={id:'workshop-bus-topology',number:'1022',kind:'bus-topology',name:'工房をつなぐ三つの道',tag:'I²C・USB・PCIe の接続',title:'装置までの道を確かめよう',story:'工房の温度計、旅人のカメラ、記録庫をそれぞれの道につなぎます。装置がどの道にいるか調べましょう。'};
export const topologyAddresses=['0x48','0x49'];
export function topologyCreate(){return {sensor:'0x48',lamp:'0x48',usb:1,pcie:2,seen:[],reflection:null};}
export function topologyResult(q,kind){
 if(kind==='i2c'){if(!topologyAddresses.includes(q.sensor)||!topologyAddresses.includes(q.lamp))throw new RangeError('アドレスが不正です。');return q.sensor===q.lamp?{ok:false,message:`同じバスの温度計と灯りが両方 ${q.sensor} に応答し、区別できません。`}:{ok:true,message:`${q.sensor} に応答するのは温度計だけです。`};}
 if(kind==='usb'){if(![1,2].includes(q.usb))throw new RangeError('ポートが不正です。');return q.usb===2?{ok:true,message:'ハブの２番ポートのカメラへ到着しました。'}:{ok:false,message:'１番ポートは鍵盤です。カメラがつながるポートを調べましょう。'};}
 if(kind==='pcie'){if(![1,2].includes(q.pcie))throw new RangeError('ポートが不正です。');return q.pcie===1?{ok:true,message:'ルートポート１のリンク先は記録庫です。'}:{ok:false,message:'ルートポート２のリンク先は画面装置です。記録庫のリンクを調べましょう。'};}
 throw new RangeError('道が不正です。');
}
export function topologyTry(q,kind){const result=topologyResult(q,kind);if(result.ok&&!q.seen.includes(kind))q.seen.push(kind);return result;}
export function topologyComplete(q){return ['i2c','usb','pcie'].every(k=>q.seen.includes(k))&&q.reflection==='different';}
export function topologyRestore(q){if(!q||!topologyAddresses.includes(q.sensor)||!topologyAddresses.includes(q.lamp)||![1,2].includes(q.usb)||![1,2].includes(q.pcie)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['i2c','usb','pcie'].includes(k))||![null,'different','same','speed'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
