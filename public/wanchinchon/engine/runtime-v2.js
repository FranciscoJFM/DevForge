/** Interpreter runtime for Wanchinchon 0.2 AST. Safe: no eval/Function. */
export function executeV2(ast,{maxSteps=20000,maxEvents=1000}={}){
 const fail=(message,line)=>{throw new Error(`${line?`Línea ${line}: `:''}${message}`);};
 let steps=0,processed=0;const state=Object.create(null),globals=Object.create(null),messages=[],trace=[],queue=[];
 const instances=new WeakSet();const variables=new WeakMap();const functions=Object.create(null);const models=Object.create(null);
 const assertStep=line=>{if(++steps>maxSteps)fail('Límite de pasos excedido',line);};
 const sameType=(value,t)=>t==='nada'?value===null||value===undefined:t==='numero'||t==='decimal'?typeof value==='number'&&Number.isFinite(value):t==='texto'?typeof value==='string':t==='logico'?typeof value==='boolean':models[t]?Boolean(value&&typeof value==='object'&&value.__wanType===t):false;
 const check=(v,type,line)=>{if(type&&!sameType(v,type))fail(`Se esperaba ${type}; se obtuvo ${v===null?'nada':typeof v}`,line);};
 function scope(parent=null){return {values:Object.create(null),parent};}
 const root=scope();
 function lookup(name,env,line){for(let e=env;e;e=e.parent)if(Object.hasOwn(e.values,name))return e.values[name].value;fail(`Símbolo desconocido: ${name}`,line);}
 function findSlot(name,env,line){for(let e=env;e;e=e.parent)if(Object.hasOwn(e.values,name))return e.values[name];fail(`Variable desconocida: ${name}`,line);}
 function define(env,name,value,mutable=true,type=null,line=0){if(Object.hasOwn(env.values,name))fail(`Declaración duplicada: ${name}`,line);check(value,type,line);env.values[name]={value,mutable,type};}
 function emit(ev){queue.push(ev);trace.push({type:'emit',event:`${ev.subject} ${ev.verb} ${ev.object}`});}
 function resolve(expr,env,line){assertStep(line);switch(expr.t){
 case 'lit':return expr.v;
 case 'get':return lookup(expr.name,env,line);
 case 'member':{const base=resolve(expr.base,env,line);if(!base||typeof base!=='object'||!Object.hasOwn(base,expr.name)&&!(base.__wanMethods&&Object.hasOwn(base.__wanMethods,expr.name)))fail(`Propiedad desconocida: ${expr.name}`,line);if(base.__wanMethods&&Object.hasOwn(base.__wanMethods,expr.name))return {__wanBound:base,fn:base.__wanMethods[expr.name]};return base[expr.name];}
 case 'unary':{const x=resolve(expr.expr,env,line);if(expr.op==='!'){if(typeof x!=='boolean')fail('«!» requiere lógico',line);return !x;}if(typeof x!=='number')fail('Negación requiere número',line);return -x;}
 case 'binary':{const a=resolve(expr.left,env,line);if(expr.op==='&&'){check(a,'logico',line);if(!a)return false;const right=resolve(expr.right,env,line);check(right,'logico',line);return right;}if(expr.op==='||'){check(a,'logico',line);if(a)return true;const right=resolve(expr.right,env,line);check(right,'logico',line);return right;}const b=resolve(expr.right,env,line);let v;switch(expr.op){case '==':return a===b;case '!=':return a!==b;case '+':if(typeof a===typeof b&&(typeof a==='number'||typeof a==='string'))return a+b;break;case '-':if(typeof a==='number'&&typeof b==='number')return a-b;break;case '*':if(typeof a==='number'&&typeof b==='number')return a*b;break;case '/':if(typeof a==='number'&&typeof b==='number'&&b!==0)return a/b;break;case '%':if(typeof a==='number'&&typeof b==='number'&&b!==0)return a%b;break;case '<':case '>':case '<=':case '>=':if(typeof a===typeof b&&(typeof a==='number'||typeof a==='string'))return expr.op==='<'?a<b:expr.op==='>'?a>b:expr.op==='<='?a<=b:a>=b;break;}fail(`Operación inválida: ${expr.op}`,line);}
 case 'construct':return construct(expr.name,expr.args.map(a=>resolve(a,env,line)),line);
 case 'call':{const fn=resolve(expr.fn,env,line),args=expr.args.map(a=>resolve(a,env,line));if(fn?.__wanBound)return call(fn.fn,args,fn.__wanBound,line);if(fn?.__wanConstructor)return construct(fn.__wanConstructor,args,line);if(fn?.__wanFunction)return call(fn,args,null,line);fail('Solo se pueden invocar funciones Wanchinchon',line);}
 default:fail(`Expresión no soportada: ${expr.t}`,line);
 }}
 function mutate(obj,key,value,line){if(obj.__wanType){const trait=models[obj.__wanType].traits.find(t=>t.name===key);if(!trait)fail(`Rasgo desconocido: ${key}`,line);check(value,trait.type,line);}if(!Object.hasOwn(obj,key)||key.startsWith('__'))fail(`Propiedad no modificable: ${key}`,line);const before=obj[key];obj[key]=value;trace.push({type:'change',entity:obj.__wanType??'objeto',trait:key,before,after:value,line});}
 function runBody(body,env){for(const s of body){assertStep(s.line);switch(s.t){
 case 'declare':define(env,s.name,resolve(s.expr,env,s.line),s.mutable,s.type,s.line);break;
 case 'print':{const v=resolve(s.expr,env,s.line);const msg=String(v);messages.push(msg);trace.push({type:'message',value:msg,line:s.line});break;}
 case 'assign':{const v=resolve(s.expr,env,s.line);if(s.target.length===1){const slot=findSlot(s.target[0],env,s.line);if(!slot.mutable)fail(`No se puede cambiar «fijo ${s.target[0]}»`,s.line);check(v,slot.type,s.line);slot.value=v;}else{const obj=lookup(s.target[0],env,s.line);if(!obj||typeof obj!=='object')fail('El destino no es un ser',s.line);mutate(obj,s.target[1],v,s.line);}break;}
 case 'move':{const being=lookup(s.name,env,s.line);lookup(s.target,env,s.line);mutate(being,'lugar',s.target,s.line);break;}
 case 'emit':emit(s.event);break;
 case 'if':{const value=resolve(s.test,env,s.line);check(value,'logico',s.line);const ret=runBody(value?s.body:(s.elseBody??[]),scope(env));if(ret.returned)return ret;break;}
 case 'repeat':{const n=resolve(s.count,env,s.line);if(!Number.isSafeInteger(n)||n<0||n>100000)fail('«repite» requiere entero entre 0 y 100000',s.line);for(let i=0;i<n;i++){const ret=runBody(s.body,scope(env));if(ret.returned)return ret;}break;}
 case 'expr':resolve(s.expr,env,s.line);break;
 case 'return':return {returned:true,value:s.expr?resolve(s.expr,env,s.line):null};
 default:fail(`Instrucción desconocida: ${s.t}`,s.line);
 }}return {returned:false,value:null};}
 function call(fn,args,receiver,line){if(args.length!==fn.params.length)fail(`«${fn.name}» esperaba ${fn.params.length} argumentos, recibió ${args.length}`,line);const env=scope(root);if(receiver)define(env,'yo',receiver,false,null,line);fn.params.forEach((p,i)=>define(env,p.name,args[i],true,p.type,line));const res=runBody(fn.body,env);if(!res.returned&&fn.returns!=='nada')fail(`«${fn.name}» debe devolver ${fn.returns}`,fn.line);check(res.value,fn.returns,fn.line);return res.value;}
 function construct(name,args,line,asSingleton=false){const model=models[name];if(!model)fail(`Ser inexistente: ${name}`,line);const obj=Object.create(null);Object.defineProperty(obj,'__wanType',{value:name,enumerable:false});Object.defineProperty(obj,'__wanMethods',{value:Object.fromEntries(model.methods.map(fn=>[fn.name,fn])),enumerable:false});for(const trait of model.traits){obj[trait.name]=null;}for(const trait of model.traits){if(trait.expr)obj[trait.name]=resolve(trait.expr,root,trait.line);if(obj[trait.name]!==null)check(obj[trait.name],trait.type,trait.line);}
 if(model.constructor&&!asSingleton)call(model.constructor,args,obj,line);else if(args.length&&!asSingleton)fail(`${name} no tiene constructor`,line);instances.add(obj);return obj;}
 for(const model of ast.entities)models[model.name]=model;
 for(const fn of ast.functions){functions[fn.name]={...fn,__wanFunction:true};define(root,fn.name,functions[fn.name],false);}
 for(const e of ast.entities)define(root,e.name,{__wanConstructor:e.name},false);
 for(const e of ast.entities){const obj=construct(e.name,[],e.line,true);state[e.name]=obj;define(root,`$${e.name}`,obj,false);}
 // entity symbols refer to singleton inhabitants inside event rules, not constructors.
 function eventScope(){const env=scope(root);for(const [name,obj] of Object.entries(state))define(env,name,obj,false);return env;}
 const env=eventScope();runBody(ast.main,env);
 while(queue.length){if(++processed>maxEvents)fail('Límite de sucesos alcanzado');const ev=queue.shift();const eventName=`${ev.subject} ${ev.verb} ${ev.object}`;trace.push({type:'event',event:eventName});for(const h of ast.handlers){const e=h.event;if(e.subject===ev.subject&&e.verb===ev.verb&&e.object===ev.object)runBody(h.body,scope(env));}}
 const outputState={};for(const [k,v]of Object.entries(state)){outputState[k]={...v};}
 const publicVars={};for(const [k,v]of Object.entries(env.values))if(!k.startsWith('$')&&!Object.hasOwn(state,k)&&!Object.hasOwn(functions,k)&&!Object.hasOwn(models,k))publicVars[k]=v.value;
 return {world:ast.name,dictionary:ast.dictionary,state:outputState,variables:publicVars,links:ast.links,messages,trace,processed,steps};
}
