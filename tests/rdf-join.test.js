import test from 'node:test';
import assert from 'node:assert/strict';
import {rdfIri,rdfModes,rdfGraph,rdfJoin,rdfCreate,rdfRestore,rdfDone} from '../src/rdf-join.js';
test('a shared RDF term joins two directed triples; a different IRI does not',()=>{
 assert.deepEqual(rdfJoin(rdfGraph('shared')),[{plant:rdfIri.plant,place:rdfIri.forest}]);assert.deepEqual(rdfJoin(rdfGraph('distinct')),[]);
 const graph=rdfGraph('shared');assert.deepEqual(rdfJoin([...graph].reverse()),rdfJoin(graph));assert.deepEqual(rdfJoin([...graph,graph[0],graph[1]]),rdfJoin(graph));
 assert.deepEqual(rdfJoin([graph[0],[graph[1][2],graph[1][1],graph[1][0]]]),[]);
 for(const mode of Object.keys(rdfModes))for(const triple of rdfGraph(mode))for(const iri of triple)assert.match(iri,/^https:\/\/[a-z.]+\//);
});
test('both cases and the open-world reflection are required, and drafts are validated',()=>{
 const q=rdfCreate();q.seen=['shared','distinct'];q.reflection='unknown';assert.equal(rdfDone(q),true);const copy=rdfRestore(q);copy.seen.pop();assert.equal(q.seen.length,2);assert.equal(rdfDone(copy),false);
 assert.throws(()=>rdfRestore({...q,seen:['shared','shared']}));assert.throws(()=>rdfRestore({...q,mode:'__proto__'}));assert.throws(()=>rdfJoin([['only two','terms']]));
});
