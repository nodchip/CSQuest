export const accessLevel = {
  id:'castle-access', number:'11', kind:'access', name:'城門の通行証', tag:'認証と認可',
  title:'城の宝物庫を守れ',
  story:'城の記録庫と物資庫を守りながら、仕事をする人は通せるように、役割ごとの許可を整えましょう。',
};

export const roles = { keeper:'管理人', courier:'配達人', visitor:'来客' };
export const resources = { records:'記録庫', supplies:'物資庫' };

// These cases model the result of an already completed identity check; no credentials are handled here.
export const cases = [
  { name:'確認済みの管理人が記録庫へ', verified:true, role:'keeper', resource:'records', expected:true },
  { name:'確認済みの管理人が物資庫へ', verified:true, role:'keeper', resource:'supplies', expected:true },
  { name:'確認済みの配達人が物資庫へ', verified:true, role:'courier', resource:'supplies', expected:true },
  { name:'確認済みの配達人が記録庫へ', verified:true, role:'courier', resource:'records', expected:false },
  { name:'確認済みの来客が記録庫へ', verified:true, role:'visitor', resource:'records', expected:false },
  { name:'確認済みの来客が物資庫へ', verified:true, role:'visitor', resource:'supplies', expected:false },
  { name:'本人確認に失敗した管理人を名乗る人が記録庫へ', verified:false, role:'keeper', resource:'records', expected:false },
];

export function emptyPolicy() {
  return Object.fromEntries(Object.keys(roles).map(role=>[role,[]]));
}

export function togglePermission(policy,role,resource) {
  if (!Object.hasOwn(roles,role) || !Object.hasOwn(resources,resource)) throw new RangeError('未知の役割または場所です。');
  const entries=policy[role].includes(resource) ? policy[role].filter(item=>item!==resource) : [...policy[role],resource];
  return {...policy,[role]:entries};
}

export function checkAccess(policy,verified,role,resource) {
  if (!Object.hasOwn(roles,role) || !Object.hasOwn(resources,resource)) return false;
  return verified === true && policy[role].includes(resource);
}

export function evaluatePolicy(policy) {
  return cases.map(item=>{ const actual=checkAccess(policy,item.verified,item.role,item.resource); return {...item,actual,correct:actual===item.expected}; });
}
