// These requests build on the garden's introductory work, but each explains
// everything needed to solve it without consulting another request.
export const gardenBasics=['garden-sets','garden-logic','garden-combinations'];
export const gardenAdvancedReady=completed=>gardenBasics.filter(id=>new Set(completed).has(id)).length>=2;

export const gardenAdvanced={
 'garden-shelter':{
  title:'花を届ける札',goal:'条件に合う花の札を集める',
  intro:'花を届け先ごとに分けたいんだ。札には花の特徴が書いてあるよ。すべての札を見て、届け先の条件に合うものを集めてね。',
  scenarios:[
   {prompt:'札は「赤・香りあり」「赤・香りなし」「白・香りあり」「白・香りなし」の４枚。赤い花か香りのある花を、すべて届けよう。両方に当てはまる札は一枚だけ運べばいいよ。',choices:['白・香りなし','赤・香りあり','白・香りあり','赤・香りなし'],answer:[1,2,3],hint:'赤い花と香りのある花を合わせ、重なる札は一度だけ数えます。'},
   {prompt:'札は「赤・香りあり」「赤・香りなし」「白・香りあり」「白・香りなし」の４枚。赤くもなく香りもない花だけを届けよう。',choices:['赤・香りなし','白・香りあり','白・香りなし','赤・香りあり'],answer:[2],hint:'赤ではなく、かつ香りもない札を選びます。'},
   {prompt:'札は「青・香りあり」「青・香りなし」「白・香りなし」の３枚。青くて香りのある花をすべて運ぼう。',choices:['青・香りなし','青・香りあり','白・香りなし'],answer:[1],hint:'「青」と「香りあり」の両方を満たす札を選びます。'}
  ]
 },
 'garden-lantern-rule':{
  title:'夜の庭を守る灯り',goal:'門を開ける条件を確かめる',
  intro:'赤と青の灯りを使って、夜に花を守る門を動かすよ。点灯と消灯の組み合わせを一つずつ考えて、安全な仕組みにしよう。',
  scenarios:[
   {prompt:'門は「赤と青が両方ついている」ときだけ開く。開かない状態をすべて選ぼう。',choices:['赤だけ点灯','両方点灯','両方消灯','青だけ点灯'],answer:[0,2,3],hint:'開くのは両方点灯の一通りだけです。'},
   {prompt:'門は「赤または青がついている」とき開く。「または」には両方点灯も含むよ。開かない状態をすべて選ぼう。',choices:['青だけ点灯','両方消灯','両方点灯','赤だけ点灯'],answer:[1],hint:'どちらか一方でもついていれば開きます。'},
   {prompt:'別の門は「赤が消えているか、青が消えている」とき開く。開く状態をすべて選ぼう。',choices:['両方点灯','青だけ点灯','両方消灯','赤だけ点灯'],answer:[1,2,3],hint:'少なくとも片方が消えている状態を探そう。両方消えている場合も含みます。'}
  ]
 }
};
export const gardenAdvancedIds=Object.keys(gardenAdvanced);
export const gardenAdvancedResults={
 'garden-shelter':{thanks:'花の特徴を見て、必要な札を集めてくれてありがとう。届け先ごとに分けられたよ。',lesson:'集合を合わせたものは和集合、共通するものは共通部分と呼びます。対象全体の中で条件に当てはまらないものを考えるときは、対象全体を決めることが大切です。'},
 'garden-lantern-rule':{thanks:'どの灯りでも門がどう動くか分かったよ。安心して夜の庭を守れるね。',lesson:'「両方が点灯」の否定は「少なくとも一方が消灯」です。「どちらかが点灯」の否定は「両方が消灯」です。すべての組み合わせを調べると確かめられます。'}
};
