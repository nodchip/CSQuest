import test from 'node:test';
import assert from 'node:assert/strict';
import {parseExpression,evaluateExpression,replayExpression} from '../src/endgame-expression.js';

test('precedence and parentheses produce different abstract trees and results',()=>{
 const a=parseExpression(['2','+','3','*','4']),b=parseExpression(['(','2','+','3',')','*','4']);
 assert.equal(a.op,'+');assert.equal(a.right.op,'*');assert.equal(evaluateExpression(a),14);
 assert.equal(b.op,'*');assert.equal(b.left.op,'+');assert.equal(evaluateExpression(b),20);
});
test('building requires order and grouping; mistakes can be reset',()=>{
 assert.equal(replayExpression('precedence',['merge:0:+','merge:0:*','check']),null);
 const h=['merge:1:*','merge:0:+','check','merge:0:+','merge:0:*','check'];
 assert.equal(replayExpression('precedence',h).done,true);
 assert.equal(replayExpression('precedence',['merge:0:+','reset']).cards.length,3);
 assert.equal(replayExpression('precedence',['merge:0:-']),null);
 const minus=['merge:0:-','merge:0:-','check','merge:1:-','merge:0:-','check'];
 assert.equal(replayExpression('association',minus).done,true);
});
test('evaluation requires child operations before the parent',()=>{
 const a=['merge:1:*','merge:0:+','check'];
 assert.equal(replayExpression('evaluate',[...a,'eval:root']),null);
 const h=[...a,'eval:R','eval:root','check','merge:0:+','merge:0:*','check','eval:L','eval:root','check'];
 assert.equal(replayExpression('evaluate',h).done,true);
});
test('subtraction associates left unless grouped',()=>{
 const a=parseExpression(['7','-','2','-','1']),b=parseExpression(['7','-','(','2','-','1',')']);
 assert.equal(a.left.op,'-');assert.equal(evaluateExpression(a),4);
 assert.equal(b.right.op,'-');assert.equal(evaluateExpression(b),6);
});
test('multiplication associates left and nested parentheses preserve structure',()=>{
 const a=parseExpression(['2','*','3','*','4']),b=parseExpression(['(','(','2','+', '3',')',')','*','4']);
 assert.equal(a.left.op,'*');assert.equal(evaluateExpression(a),24);
 assert.equal(b.left.op,'+');assert.equal(evaluateExpression(b),20);
});
test('invalid sequences and malformed trees are rejected',()=>{
 for(const tokens of [[],['2','+'],['(','2','+','3'],['2','3'],['2',')'],['(','2',')',')'],['-','1'],['12']])assert.equal(parseExpression(tokens),null);
 assert.equal(evaluateExpression({op:'/',left:{number:1},right:{number:2}}),null);
});
