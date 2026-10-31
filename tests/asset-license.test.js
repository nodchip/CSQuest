import test from 'node:test';
import assert from 'node:assert/strict';
import {createAssetLicense,inspectAssetLicense,assetLicenseProblems,assetLicenseComplete,restoreAssetLicense} from '../src/asset-license.js';
test('commercial project needs a permitted asset and all given attribution information',()=>{let s=createAssetLicense();s=inspectAssetLicense(s);s.selected='nc';s=inspectAssetLicense(s);Object.assign(s,{credit:true,license:true,changes:true});assert.equal(assetLicenseProblems(s).length,1);s.selected='by';assert.deepEqual(assetLicenseProblems(s),[]);s.answer='terms';s.checked=true;assert.equal(assetLicenseComplete(s),true);assert.deepEqual(restoreAssetLicense(s),s);});
test('rejects duplicated or invalid inspection records',()=>{const s=createAssetLicense();assert.throws(()=>restoreAssetLicense({...s,seen:['by','by']}));assert.throws(()=>restoreAssetLicense({...s,seen:['unknown']}));});
