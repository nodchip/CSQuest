export const commands = {
  forward: { label: '前へ進む', icon: '↑', description: '向いている方向に１マス進む。' },
  right: { label: '右を向く', icon: '↱', description: 'その場で右に向きを変える。' },
  ifWall: { label: '壁なら右を向く', icon: '◇', description: '前が壁なら右を向く。壁がなければ何もしない。' },
  twice: { label: '２回進む', icon: '↟', description: '前へ進む動作を２回繰り返す。' },
};

export const levels = [
  { id: 'sequence', number: '01', name: 'はじめての届けもの', tag: '順序', title: '灯りを、工房へ', story: '工房の灯りが消えてしまいました。精霊に道順を伝え、灯りのかけらを届けましょう。', hint: '精霊は右向きに出発します。前に進む命令を２つ並べてみましょう。', lesson: '命令は並べた順番に一つずつ実行されます。この順序を変えると、結果も変わることがあります。', cols: 3, rows: 1, start: [0,0], direction: 1, goal: [2,0], walls: [], available: ['forward','right'], max: 4 },
  { id: 'branch', number: '02', name: '曲がり角のひみつ', tag: '条件分岐', title: '壁の向こうの道', story: '道の先は壁。精霊が前を確かめ、必要なときだけ向きを変えられるようにしましょう。', hint: '１歩進んだら壁です。「壁なら右を向く」を使い、その後に進みましょう。', lesson: '条件分岐は、条件が成り立つ場合にだけ操作を行います。壁がない場合、その命令では向きは変わりません。', cols: 3, rows: 2, start: [0,0], direction: 1, goal: [1,1], walls: [[2,0],[0,1],[2,1]], available: ['forward','ifWall'], max: 4 },
  { id: 'loop', number: '03', name: 'ふたつの橋を越えて', tag: '繰り返し', title: '精霊の試練', story: '工房の守り手が目覚めました。限られた命令で二つの橋を渡り、灯りを届けてください。', hint: '「２回進む」は１枚で前進を２回行います。曲がり角を越えた後にも使えます。', lesson: '繰り返しは、同じ操作をまとめて表す方法です。ここでは２回と決まっていますが、繰り返す回数を条件などで決める方法もあります。', cols: 3, rows: 3, start: [0,0], direction: 1, goal: [2,2], walls: [[0,1],[1,1],[0,2],[1,2]], available: ['forward','right','twice'], max: 3 },
  { id: 'two-paths', number: '04', name: 'ふたつの道への約束', tag: '条件とテスト', title: '変わる道を越えて', story: '街への道は日によって変わります。ひとつの命令の並びで、両方の道に灯りを届けましょう。', hint: '一歩進んだところで、壁がある場合だけ右を向く命令を使ってみましょう。', lesson: '同じ命令でも、周囲の状態によって条件分岐の結果が変わります。複数の状況で試すと、ひとつの例では気づかない問題を見つけられます。', cols: 3, rows: 2, start: [0,0], direction: 1, goal: [1,1], walls: [[2,0],[0,1],[2,1]], available: ['forward','right','ifWall'], max: 3, scenarios: [
    { name:'曲がり道', goal:[1,1], walls:[[2,0],[0,1],[2,1]] },
    { name:'まっすぐな道', goal:[2,0], walls:[[0,1],[1,1],[2,1]] },
  ] },
];

// Directions: up, right, down, left. Edges and blocked cells are walls.
const vectors = [[0,-1],[1,0],[0,1],[-1,0]];
export function run(level, program) {
  let [x,y] = level.start;
  let direction = level.direction;
  const trace = [{x,y,direction,message:'出発！'}];
  const blocked = () => { const [dx,dy] = vectors[direction]; const nx=x+dx, ny=y+dy; return nx<0 || ny<0 || nx>=level.cols || ny>=level.rows || level.walls.some(([wx,wy])=>wx===nx&&wy===ny); };
  const step = () => {
    if (blocked()) { trace.push({x,y,direction,message:'前は壁。進めませんでした。'}); return false; }
    const [dx,dy] = vectors[direction]; x+=dx; y+=dy; trace.push({x,y,direction,message:'１マス進みました。'}); return true;
  };
  for (const command of program) {
    if (!level.available.includes(command)) throw new Error('この依頼では使えない命令です。');
    if (command === 'forward') step();
    if (command === 'right') { direction=(direction+1)%4; trace.push({x,y,direction,message:'右を向きました。'}); }
    if (command === 'ifWall') { const wall=blocked(); if (wall) direction=(direction+1)%4; trace.push({x,y,direction,message:wall?'壁があるので右を向きました。':'壁がないので、そのままです。'}); }
    if (command === 'twice') { step(); step(); }
  }
  return { success:x===level.goal[0]&&y===level.goal[1], trace };
}

export function runScenarios(level, program) {
  const scenarios = level.scenarios || [{ name: '通り道' }];
  const cases = scenarios.map(scenario => ({
    name: scenario.name,
    ...run({ ...level, ...scenario }, program),
  }));
  return { success: cases.every(item => item.success), cases };
}
