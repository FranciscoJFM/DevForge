/** Wanchinchon Lang 0.1: intérprete de mundos reactivos, sin dependencias. */
export class WanError extends Error {
  constructor(message, line = null) {
    super(line === null ? message : `Línea ${line}: ${message}`);
    this.name = 'WanError';
    this.line = line;
  }
}

const ID = '[\\p{L}_][\\p{L}\\p{N}_-]*';
const dotted = new RegExp(`^(${ID})\\.(${ID})$`, 'u');
const entityPattern = new RegExp(`^${ID}$`, 'u');
const eventPattern = new RegExp(`^(${ID})\\s+(${ID})\\s+(${ID})$`, 'u');

function stripComment(line) {
  let quote = false;
  let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\' && quote) { escaped = true; continue; }
    if (c === '"') quote = !quote;
    if (c === '#' && !quote) return line.slice(0, i);
  }
  return line;
}

function literal(raw, line) {
  const v = raw.trim();
  if (!v) throw new WanError('Falta un valor', line);
  if (v.startsWith('"')) {
    try {
      const parsed = JSON.parse(v);
      if (typeof parsed !== 'string') throw Error('No es texto');
      return {kind: 'literal', value: parsed};
    } catch { throw new WanError('Cadena de texto inválida; usa comillas dobles', line); }
  }
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(v)) return {kind:'literal', value:Number(v)};
  if (v === 'verdadero') return {kind:'literal', value:true};
  if (v === 'falso') return {kind:'literal', value:false};
  if (dotted.test(v)) return {kind:'reference', value:v};
  if (entityPattern.test(v)) return {kind:'literal', value:v};
  throw new WanError(`Expresión no válida: ${v}`, line);
}

function eventKey(expr, line) {
  const match = expr.trim().match(eventPattern);
  if (!match) throw new WanError('Un suceso debe escribirse «Ser acción Objeto»', line);
  return {subject:match[1], verb:match[2], object:match[3]};
}

/** Traduce texto Wanchinchon a un AST puro y serializable. */
export function parse(source) {
  const ast = {type:'world', name:null, dictionary:{}, entities:[], links:[], handlers:[], initial:[]};
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const stack = [];
  const current = () => stack[stack.length - 1];
  const needWorld = line => { if (!ast.name) throw new WanError('Declara primero «mundo Nombre»', line); };
  for (let i = 0; i < lines.length; i++) {
    const line = i + 1;
    const t = stripComment(lines[i]).trim();
    if (!t) continue;
    let m;
    if (t === 'fin') {
      if (!stack.length) throw new WanError('«fin» sin un bloque abierto', line);
      stack.pop();
      continue;
    }
    if ((m = t.match(new RegExp(`^mundo\\s+(${ID})$`, 'u')))) {
      if (ast.name || stack.length) throw new WanError('Solo puede existir un mundo raíz', line);
      ast.name=m[1]; stack.push({kind:'world'}); continue;
    }
    needWorld(line);
    const ctx = current();
    if (!ctx) throw new WanError('Contenido fuera del mundo; revisa «fin»', line);
    if (ctx.kind === 'world') {
      if ((m = t.match(new RegExp(`^palabra\\s+(${ID})\\s*=\\s*(.+)$`, 'u')))) {
        if (Object.hasOwn(ast.dictionary,m[1])) throw new WanError('Palabra repetida', line);
        const v=literal(m[2],line);
        if(v.kind!=='literal'||typeof v.value!=='string') throw new WanError('El significado debe ser texto',line);
        ast.dictionary[m[1]]=v.value;continue;
      }
      if ((m = t.match(new RegExp(`^ser\\s+(${ID})$`, 'u')))) {
        if(ast.entities.some(e=>e.name===m[1])) throw new WanError(`Ser duplicado: ${m[1]}`,line);
        const entity={name:m[1],traits:{},line};ast.entities.push(entity);
        stack.push({kind:'entity',entity}); continue;
      }
      if ((m = t.match(new RegExp(`^vinculo\\s+(${ID})\\s+(${ID})\\s+(${ID})$`, 'u')))) {
        ast.links.push({from:m[1],relation:m[2],to:m[3],line});continue;
      }
      if (t.startsWith('cuando ')) {
        const event=eventKey(t.slice(7),line);
        const handler={event,actions:[],line};ast.handlers.push(handler);
        stack.push({kind:'actions',actions:handler.actions});continue;
      }
      if (t.startsWith('ocurre ')) {ast.initial.push({event:eventKey(t.slice(7),line),line});continue;}
      throw new WanError(`Instrucción no válida en el mundo: ${t}`,line);
    }
    if (ctx.kind==='entity') {
      m=t.match(new RegExp(`^rasgo\\s+(${ID})\\s*=\\s*(.+)$`,'u'));
      if(!m) throw new WanError('Dentro de un ser utiliza «rasgo nombre = valor»',line);
      if(Object.hasOwn(ctx.entity.traits,m[1])) throw new WanError(`Rasgo duplicado: ${m[1]}`,line);
      ctx.entity.traits[m[1]]=literal(m[2],line);continue;
    }
    if (ctx.kind==='actions') {
      if((m=t.match(new RegExp(`^cambia\\s+(${ID})\\.(${ID})\\s*=\\s*(.+)$`,'u')))) {
        ctx.actions.push({op:'set',entity:m[1],trait:m[2],value:literal(m[3],line),line});continue;
      }
      if((m=t.match(new RegExp(`^mueve\\s+(${ID})\\s+a\\s+(${ID})$`,'u')))) {
        ctx.actions.push({op:'move',entity:m[1],target:m[2],line});continue;
      }
      if((m=t.match(/^dice\s+(.+)$/u))) {ctx.actions.push({op:'print',value:literal(m[1],line),line});continue;}
      if(t.startsWith('emite ')) {ctx.actions.push({op:'emit',event:eventKey(t.slice(6),line),line});continue;}
      if((m=t.match(new RegExp(`^si\\s+(${ID})\\.(${ID})\\s*(==|!=|>=|<=|>|<)\\s*(.+)$`,'u')))) {
        const test={entity:m[1],trait:m[2],operator:m[3],value:literal(m[4],line)};
        const branch={op:'if',test,actions:[],line};ctx.actions.push(branch);
        stack.push({kind:'actions',actions:branch.actions});continue;
      }
      throw new WanError(`Acción desconocida: ${t}`,line);
    }
  }
  if(!ast.name) throw new WanError('No existe «mundo»');
  if(stack.length) throw new WanError(`Faltan ${stack.length} «fin» para cerrar los bloques`);
  validate(ast);
  return ast;
}

function validate(ast) {
  const beings=new Map(ast.entities.map(e=>[e.name,e]));
  const assertBeing=(name,line)=>{if(!beings.has(name))throw new WanError(`El ser «${name}» no existe`,line);};
  const assertTrait=(name,trait,line)=>{
    assertBeing(name,line);
    if(!Object.hasOwn(beings.get(name).traits,trait))throw new WanError(`El rasgo «${name}.${trait}» no existe`,line);
  };
  const checkVal=(v,line)=>{if(v.kind==='reference'){const [e,t]=v.value.split('.');assertTrait(e,t,line);}};
  const checkEvent=(ev,line)=>{assertBeing(ev.subject,line);assertBeing(ev.object,line);};
  for(const e of ast.entities)for(const v of Object.values(e.traits))checkVal(v,e.line);
  for(const link of ast.links){assertBeing(link.from,link.line);assertBeing(link.to,link.line);}
  for(const h of ast.handlers)checkEvent(h.event,h.line);
  for(const item of ast.initial)checkEvent(item.event,item.line);
  const checkActions=actions=>{
    for(const a of actions){
      if(a.op==='set'){assertTrait(a.entity,a.trait,a.line);checkVal(a.value,a.line);}
      if(a.op==='move'){assertBeing(a.entity,a.line);assertBeing(a.target,a.line);assertTrait(a.entity,'lugar',a.line);}
      if(a.op==='print')checkVal(a.value,a.line);
      if(a.op==='emit')checkEvent(a.event,a.line);
      if(a.op==='if'){assertTrait(a.test.entity,a.test.trait,a.line);checkVal(a.test.value,a.line);checkActions(a.actions);}
    }
  };
  for(const h of ast.handlers)checkActions(h.actions);
}

function evalExpr(expr,state){
  if(expr.kind==='literal')return expr.value;
  const [name,trait]=expr.value.split('.');return state[name][trait];
}
function compare(a,op,b){
  if(op==='==')return a===b;
  if(op==='!=')return a!==b;
  if(typeof a!==typeof b||!['number','string'].includes(typeof a))return false;
  if(op==='>')return a>b;
  if(op==='<')return a<b;
  if(op==='>=')return a>=b;
  if(op==='<=')return a<=b;
  return false;
}
function key(e){return `${e.subject} ${e.verb} ${e.object}`;}

/** Ejecuta sucesos deterministas; ninguna instrucción permite evaluar JS del usuario. */
export function execute(ast, {maxEvents=1000,maxActions=10000,events=null}={}) {
  const state={};
  for(const entity of ast.entities){state[entity.name]={};}
  for(const entity of ast.entities){for(const [k,v]of Object.entries(entity.traits))state[entity.name][k]=evalExpr(v,state);}
  const messages=[],trace=[],queue=(events ? events.map(e=>typeof e==='string'?eventKey(e,null):e) : ast.initial.map(x=>x.event));
  let operations=0,processed=0;
  const runActions=(actions)=>{
    for(const a of actions){
      operations++;
      if(operations>maxActions)throw new WanError('Límite de acciones alcanzado; posible ciclo infinito',a.line);
      if(a.op==='set'){const before=state[a.entity][a.trait];const after=evalExpr(a.value,state);state[a.entity][a.trait]=after;trace.push({type:'change',entity:a.entity,trait:a.trait,before,after,line:a.line});}
      if(a.op==='move'){const before=state[a.entity].lugar;state[a.entity].lugar=a.target;trace.push({type:'move',entity:a.entity,from:before,to:a.target,line:a.line});}
      if(a.op==='print'){const msg=String(evalExpr(a.value,state));messages.push(msg);trace.push({type:'message',value:msg,line:a.line});}
      if(a.op==='emit'){queue.push(a.event);trace.push({type:'emit',event:key(a.event),line:a.line});}
      if(a.op==='if'){const pass=compare(state[a.test.entity][a.test.trait],a.test.operator,evalExpr(a.test.value,state));trace.push({type:'condition',passed:pass,line:a.line});if(pass)runActions(a.actions);}
    }
  };
  while(queue.length){
    if(++processed>maxEvents)throw new WanError('Límite de sucesos alcanzado; posible ciclo infinito');
    const event=queue.shift();trace.push({type:'event',event:key(event)});
    for(const handler of ast.handlers){if(key(handler.event)===key(event))runActions(handler.actions);}
  }
  return {world:ast.name,dictionary:ast.dictionary,state,links:ast.links.map(({from,relation,to})=>({from,relation,to})),messages,trace,processed};
}
export function run(source,options){const ast=parse(source);return {ast,result:execute(ast,options)};}
