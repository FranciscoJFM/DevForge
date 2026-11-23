// Module Web Worker; executes the actual interpreter and isolates runaway code.
import {run} from './engine/core.js';
import {parseV2} from './engine/v2.js';
import {executeV2} from './engine/runtime-v2.js';
self.addEventListener('message', ({data}) => {
  const id=data?.id;
  try {
    const source=data?.source;
    if(typeof source!=='string' || source.length>30000) throw new Error('Máximo permitido: 30 000 caracteres.');
    const version=data?.version==='0.1'?'0.1':'0.2';
    const result=version==='0.2' ? executeV2(parseV2(source),{maxSteps:10000,maxEvents:150}) : run(source,{maxEvents:150,maxActions:10000}).result;
    self.postMessage({id,ok:true,version,result});
  } catch(error) {
    self.postMessage({id,ok:false,error:{message:error?.message||'Error desconocido',line:error?.line??null,column:error?.column??null}});
  }
});
