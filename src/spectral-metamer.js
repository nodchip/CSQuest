export const spectralLevel={id:'ruin-spectral-metamer',number:'888',kind:'spectral-metamer',name:'同じ色に見える二枚の布',tag:'波長と分光反射',title:'灯りを変えて布を見比べよう',story:'二枚の布は同じ色に見えるように作られました。光の波長ごとの反射と、別の灯りでの受光値を比べましょう。'};
export const spectralBands=[450,500,550,650];
export const spectralMaterials={A:{name:'布Ａ',reflectance:[0.5,0,0.5,0.5]},B:{name:'布Ｂ',reflectance:[0,1,0,0.5]}};
export const spectralLights={flat:{name:'４帯が同じ強さの灯り',power:[1,1,1,1]},filtered:{name:'500 nm を半分にした灯り',power:[1,0.5,1,1]}};
export const spectralSensors={R:[0,0,0,1],G:[0,0.5,1,0],B:[1,0.5,0,0]};
export function spectralMeasure(material,light){if(!Object.hasOwn(spectralMaterials,material)||!Object.hasOwn(spectralLights,light))throw new RangeError('条件が不正です。');const m=spectralMaterials[material],l=spectralLights[light],reflected=m.reflectance.map((r,i)=>r*l.power[i]),channels=Object.fromEntries(Object.entries(spectralSensors).map(([name,weights])=>[name,weights.reduce((sum,w,i)=>sum+w*reflected[i],0)]));return {reflected,channels};}
export function spectralCreate(){return {material:'A',light:'flat',seen:[],last:null,spectrum:null,lighting:null};}
export function spectralInspect(q){spectralMeasure(q.material,q.light);const k=`${q.material}:${q.light}`;if(!q.seen.includes(k))q.seen.push(k);q.last=k;}
export function spectralComplete(q){return ['A:flat','B:flat','A:filtered','B:filtered'].every(k=>q.seen.includes(k))&&q.spectrum==='different'&&q.lighting==='change';}
export function spectralRestore(q){if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['A:flat','B:flat','A:filtered','B:filtered'].includes(k))||!(q.last===null||q.seen.includes(q.last))||![null,'different','same','unique'].includes(q.spectrum)||![null,'change','always','fixed'].includes(q.lighting))throw new RangeError('記録が不正です。');spectralMeasure(q.material,q.light);return {material:q.material,light:q.light,seen:[...q.seen],last:q.last,spectrum:q.spectrum,lighting:q.lighting};}
