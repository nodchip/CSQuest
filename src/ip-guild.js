export const ipGuildLevel={id:'guild-ip-guild',number:'956',kind:'ip-guild',name:'工房の知恵を守る',tag:'知的財産の種類',title:'知恵と印の保護を調べる',story:'祭りに集まった工房から、作品や発明、名前と秘密の守り方について相談が届きました。対象と保護の種類を調べましょう。'};
export const ipTypes={copyright:'著作権',patent:'特許',trademark:'商標',secret:'営業秘密'};
// The scenario states which legal prerequisites are assumed to hold. It is a
// classification exercise, not an assessment of actual ownership or validity.
export const ipCases={
 story:{name:'創作した物語',description:'独創的な物語をデジタルの文章として記録しました。ここではその文章表現に関する保護を考えます。',rights:['copyright'],explanation:'記録された創作的な文章表現には著作権が関わります。物語の着想そのものと文章表現を区別します。'},
 device:{name:'特許が成立した装置',description:'公開された新しい装置について、特許が有効に成立し、対象の装置はその請求項に入るものとします。装置の技術に関する保護を選びます。',rights:['patent'],explanation:'有効な特許の請求項に入る装置には特許が関わります。特許の成立は仮定で、単に考えただけで成立するわけではありません。'},
 name:{name:'商品の出所を示す名前',description:'商品に用いる識別力のある名前で、商標としての保護要件を満たすとします。短い名前自体の保護を選びます。',rights:['trademark'],explanation:'商品の出所を識別する名前には商標が関わります。短い名前そのものは通常、著作権の保護対象ではありません。'},
 recipe:{name:'非公開の製法',description:'一般に知られていない製法に経済的価値があり、秘密を保つ合理的な措置が取られ、営業秘密の要件を満たすとします。製法自体の保護を選びます。',rights:['secret'],explanation:'秘密であることに経済的価値があり、合理的に秘密管理された情報には営業秘密が関わります。'},
 emblem:{name:'創作された工房の紋章',description:'独創的な絵を固定し、同じ絵を商品の出所を識別する商標としても使い、双方の保護要件を満たすとします。絵と出所表示の両方を選びます。',rights:['copyright','trademark'],explanation:'独創的な絵の表現と、出所を示す標識という異なる側面に、著作権と商標が関わり得ます。'},
 public:{name:'広く知られた手順',description:'既に広く知られた単なる手順で、特許や商標はなく、秘密でもないとします。文章や図ではなく手順自体に、この４種類のどれが関わるか選びます。',rights:[],explanation:'この仮定では、手順自体は著作権の表現ではなく、特許・商標・秘密の条件もありません。何も選ばず確認できます。'}
};
export function ipCreate(){return {scenario:'story',selected:[],completed:[],last:null,reflection:null,material:null};}
export function ipCheck(scenario,selected){if(!Object.hasOwn(ipCases,scenario)||!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(k=>!Object.hasOwn(ipTypes,k)))throw new RangeError('条件が不正です。');const expected=ipCases[scenario].rights;return selected.length===expected.length&&expected.every(k=>selected.includes(k));}
export function ipInspect(q){const correct=ipCheck(q.scenario,q.selected);q.last={scenario:q.scenario,selected:[...q.selected],correct};if(correct&&!q.completed.includes(q.scenario))q.completed.push(q.scenario);}
export function ipComplete(q){return Object.keys(ipCases).every(k=>q.completed.includes(k))&&q.reflection==='independent'&&q.material==='information';}
export function ipRestore(q){if(!q||!Object.hasOwn(ipCases,q.scenario)||!Array.isArray(q.completed)||new Set(q.completed).size!==q.completed.length||q.completed.some(k=>!Object.hasOwn(ipCases,k))||![null,'independent','exclusive','public'].includes(q.reflection)||![null,'information','device','identical'].includes(q.material))throw new RangeError('記録が不正です。');ipCheck(q.scenario,q.selected);let last=null;if(q.last!==null){const l=q.last;if(!l||l.correct!==ipCheck(l.scenario,l.selected))throw new RangeError('記録が不正です。');last={scenario:l.scenario,selected:[...l.selected],correct:l.correct};}return {scenario:q.scenario,selected:[...q.selected],completed:[...q.completed],last,reflection:q.reflection,material:q.material};}
