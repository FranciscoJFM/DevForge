/** Wanchinchon Lang 0.2 experimental parser and type checker. No eval. */
export class Wan2Error extends Error {constructor(message,line=0,column=1){super(`${line?`Línea ${line}, columna ${column}: `:''}${message}`);this.name='Wan2Error';this.line=line;this.column=column;}}
const ID='[\\p{L}_][\\p{L}\\p{N}_]*';
const nameRe=new RegExp(`^${ID}$`,'u');
const typeNames=new Set(['texto','numero','decimal','logico','nada']);
function clean(s){let quoted=false,escape=false;for(let i=0;i<s.length;i++){const c=s[i];if(escape){escape=false;continue;}if(c==='\\'&&quoted){escape=true;continue;}if(c==='"')quoted=!quoted;if(c==='#'&&!quoted)return s.slice(0,i);}return s;}
function tokenize(s,line){const tokens=[];let i=0;while(i<s.length){if(/\s/u.test(s[i])){i++;continue;}const col=i+1;const tail=s.slice(i);let m;
if(s[i]==='"'){let j=i+1,esc=false;for(;j<s.length;j++){if(esc){esc=false;continue;}if(s[j]==='\\'){esc=true;continue;}if(s[j]==='"')break;}if(j>=s.length)throw new Wan2Error('Texto sin cerrar',line,col);let val;try{val=JSON.parse(s.slice(i,j+1));}catch{throw new Wan2Error('Escape de texto inválido',line,col);}tokens.push({k:'lit',v:val,col});i=j+1;continue;}
if((m=tail.match(/^(?:\d+(?:\.\d+)?|\.\d+)/))){tokens.push({k:'lit',v:Number(m[0]),col});i+=m[0].length;continue;}
if((m=tail.match(new RegExp(`^${ID}`,'u')))){const v=m[0];tokens.push(['verdadero','falso'].includes(v)?{k:'lit',v:v==='verdadero',col}:{k:'id',v,col});i+=v.length;continue;}
if((m=tail.match(/^(==|!=|>=|<=|&&|\|\||[+*\/%!()<>.,\-])/))){tokens.push({k:m[0],v:m[0],col});i+=m[0].length;continue;}
throw new Wan2Error(`Carácter inválido «${s[i]}»`,line,col);
}tokens.push({k:'eof',col:s.length+1});return tokens;}
export function expression(text,line){if(/^crea\s+/u.test(text.trim())){const inner=expression(text.trim().replace(/^crea\s+/u,''),line);if(inner.t!=='call'||inner.fn.t!=='get')throw new Wan2Error('«crea» requiere Nombre(argumentos)',line);return {t:'construct',name:inner.fn.name,args:inner.args};}const ts=tokenize(text,line);let p=0;const peek=()=>ts[p],take=()=>ts[p++];const expect=k=>{if(peek().k!==k)throw new Wan2Error(`Se esperaba «${k}»`,line,peek().col);return take();};
const bp={'||':1,'&&':2,'==':3,'!=':3,'<':4,'>':4,'<=':4,'>=':4,'+':5,'-':5,'*':6,'/':6,'%':6};
function parse(min=0){let t=take(),left;if(t.k==='lit')left={t:'lit',v:t.v};else if(t.k==='id')left={t:'get',name:t.v};else if(t.k==='('){left=parse();expect(')');}else if(t.k==='!'||t.k==='-')left={t:'unary',op:t.k,expr:parse(7)};else throw new Wan2Error('Se esperaba una expresión',line,t.col);
while(true){const k=peek().k;if(k==='.'&&8>=min){take();left={t:'member',base:left,name:expect('id').v};continue;}if(k==='('&&8>=min){take();const args=[];if(peek().k!==')'){do{args.push(parse());if(peek().k!==',')break;take();}while(true);}expect(')');left={t:'call',fn:left,args};continue;}const power=bp[k]??0;if(!power||power<min)break;take();left={t:'binary',op:k,left,right:parse(power+1)};}return left;}
const ast=parse();if(peek().k!=='eof')throw new Wan2Error('Símbolos inesperados al final de la expresión',line,peek().col);return ast;}
function argsSpec(raw,line){if(!raw.trim())return [];return raw.split(',').map(x=>{const m=x.trim().match(new RegExp(`^(${ID})\\s*:\\s*(${ID})$`,'u'));if(!m)throw new Wan2Error('Parámetro inválido (usa nombre: tipo)',line);return {name:m[1],type:m[2]};});}
function statement(t,line,ctx){let m;
if((m=t.match(new RegExp(`^(chon|fijo)\\s+(${ID})(?:\\s*:\\s*(${ID}))?\\s*=\\s*(.+)$`,'u'))))return {t:'declare',mutable:m[1]==='chon',name:m[2],type:m[3]??null,expr:expression(m[4],line),line};
if((m=t.match(/^dice\s+(.+)$/u)))return {t:'print',expr:expression(m[1],line),line};
if((m=t.match(new RegExp(`^devuelve(?:\\s+(.+))?$`,'u'))))return {t:'return',expr:m[1]?expression(m[1],line):null,line};
if((m=t.match(new RegExp(`^cambia\\s+(${ID}(?:\\.${ID})?)\\s*=\\s*(.+)$`,'u'))))return {t:'assign',target:m[1].split('.'),expr:expression(m[2],line),line};
if((m=t.match(new RegExp(`^(${ID}(?:\\.${ID})?)\\s*=\\s*(.+)$`,'u'))))return {t:'assign',target:m[1].split('.'),expr:expression(m[2],line),line};
if((m=t.match(new RegExp(`^mueve\\s+(${ID})\\s+a\\s+(${ID})$`,'u'))))return {t:'move',name:m[1],target:m[2],line};
if((m=t.match(/^emite\s+(.+)$/u)))return {t:'emit',event:event(m[1],line),line};
if((m=t.match(/^ocurre\s+(.+)$/u)))return {t:'emit',event:event(m[1],line),line};
if((m=t.match(/^si\s+(.+)$/u)))return {t:'if',test:expression(m[1],line),body:[],elseBody:null,line,block:true};
if((m=t.match(/^repite\s+(.+)\s+veces$/u)))return {t:'repeat',count:expression(m[1],line),body:[],line,block:true};
if(t==='sino')return {t:'elseMarker',line};
if((m=t.match(/^(.+)$/u))){const e=expression(m[1],line);if(e.t!=='call')throw new Wan2Error(`Instrucción desconocida «${t}»`,line);return {t:'expr',expr:e,line};}
}
function event(raw,line){const m=raw.trim().match(new RegExp(`^(${ID})\\s+(${ID})\\s+(${ID})$`,'u'));if(!m)throw new Wan2Error('Un evento debe ser «Ser acción Ser»',line);return {subject:m[1],verb:m[2],object:m[3]};}
export function parseV2(src){const ast={version:2,t:'world',name:null,dictionary:{},entities:[],links:[],functions:[],handlers:[],main:[]};const stack=[];const lines=src.replace(/\r\n/g,'\n').split('\n');const top=()=>stack.at(-1);function add(s,ctx,line){const node=statement(s,line,ctx);if(node.t==='elseMarker'){if(ctx.kind!=='stmts'||ctx.owner?.t!=='if'||ctx.elseSeen)throw new Wan2Error('«sino» debe seguir a un «si»',line);ctx.elseSeen=true;ctx.list=ctx.owner.elseBody=[];return;}if(ctx.kind!=='stmts')throw new Wan2Error('Instrucción fuera de un bloque ejecutable',line);ctx.list.push(node);if(node.block)stack.push({kind:'stmts',list:node.body,owner:node});}
for(let i=0;i<lines.length;i++){const line=i+1,t=clean(lines[i]).trim();if(!t)continue;let m;if(t==='fin'){if(!stack.length)throw new Wan2Error('«fin» sin bloque abierto',line);stack.pop();continue;}
if(!ast.name){m=t.match(new RegExp(`^mundo\\s+(${ID})$`,'u'));if(!m)throw new Wan2Error('El programa debe comenzar con «mundo Nombre»',line);ast.name=m[1];stack.push({kind:'world'});continue;}
const ctx=top();if(!ctx)throw new Wan2Error('Código fuera del mundo',line);
if(ctx.kind==='world'){
if((m=t.match(new RegExp(`^palabra\\s+(${ID})\\s*=\\s*(.+)$`,'u')))){const val=expression(m[2],line);if(val.t!=='lit'||typeof val.v!=='string')throw new Wan2Error('La palabra requiere texto literal',line);if(Object.hasOwn(ast.dictionary,m[1]))throw new Wan2Error('Palabra duplicada',line);ast.dictionary[m[1]]=val.v;continue;}
if((m=t.match(new RegExp(`^ser\\s+(${ID})$`,'u')))){const entity={name:m[1],traits:[],constructor:null,methods:[],line};ast.entities.push(entity);stack.push({kind:'entity',entity});continue;}
if((m=t.match(new RegExp(`^hacer\\s+(${ID})\\s*\\(([^)]*)\\)(?:\\s*->\\s*(${ID}))?$`,'u')))){const fn={name:m[1],params:argsSpec(m[2],line),returns:m[3]??'nada',body:[],line};ast.functions.push(fn);stack.push({kind:'stmts',list:fn.body,owner:fn});continue;}
if((m=t.match(new RegExp(`^vinculo\\s+(${ID})\\s+(${ID})\\s+(${ID})$`,'u')))){ast.links.push({from:m[1],relation:m[2],to:m[3],line});continue;}
if(t.startsWith('cuando ')){const handler={event:event(t.slice(7),line),body:[],line};ast.handlers.push(handler);stack.push({kind:'stmts',list:handler.body,owner:handler});continue;}
add(t,{kind:'stmts',list:ast.main},line);continue;
}
if(ctx.kind==='entity'){
if((m=t.match(new RegExp(`^rasgo\\s+(${ID})(?:\\s*:\\s*(${ID}))?(?:\\s*=\\s*(.+))?$`,'u')))){ctx.entity.traits.push({name:m[1],type:m[2]??null,expr:m[3]?expression(m[3],line):null,line});continue;}
if((m=t.match(/^nace\s*\(([^)]*)\)$/u))){if(ctx.entity.constructor)throw new Wan2Error('Constructor duplicado',line);const fn={name:'nace',params:argsSpec(m[1],line),returns:'nada',body:[],line};ctx.entity.constructor=fn;stack.push({kind:'stmts',list:fn.body,owner:fn});continue;}
if((m=t.match(new RegExp(`^hacer\\s+(${ID})\\s*\\(([^)]*)\\)(?:\\s*->\\s*(${ID}))?$`,'u')))){const fn={name:m[1],params:argsSpec(m[2],line),returns:m[3]??'nada',body:[],line};ctx.entity.methods.push(fn);stack.push({kind:'stmts',list:fn.body,owner:fn});continue;}
throw new Wan2Error('Dentro de un ser usa «rasgo», «nace» o «hacer»',line);
}
add(t,ctx,line);
}
if(stack.length)throw new Wan2Error(`Faltan ${stack.length} «fin»`);validateV2(ast);return ast;}
function validateV2(ast){const seen=(items,label)=>{const names=new Set();for(const x of items){if(names.has(x.name))throw new Wan2Error(`${label} duplicado: ${x.name}`,x.line);names.add(x.name);}return names;};const entities=seen(ast.entities,'Ser'),functions=seen(ast.functions,'Función');const types=new Set([...typeNames,...entities]);for(const e of ast.entities){seen(e.traits,'Rasgo');seen(e.methods,'Método');for(const t of e.traits)if(t.type&&!types.has(t.type))throw new Wan2Error(`Tipo desconocido: ${t.type}`,t.line);}
for(const fn of [...ast.functions,...ast.entities.flatMap(e=>[e.constructor,...e.methods].filter(Boolean))]){if(!types.has(fn.returns))throw new Wan2Error(`Tipo de retorno desconocido: ${fn.returns}`,fn.line);const names=new Set();for(const p of fn.params){if(!types.has(p.type))throw new Wan2Error(`Tipo desconocido: ${p.type}`,fn.line);if(names.has(p.name))throw new Wan2Error(`Parámetro duplicado: ${p.name}`,fn.line);names.add(p.name);}}
for(const link of ast.links){if(!entities.has(link.from)||!entities.has(link.to))throw new Wan2Error('Vínculo contiene un ser inexistente',link.line);}for(const h of ast.handlers){if(!entities.has(h.event.subject)||!entities.has(h.event.object))throw new Wan2Error('Evento contiene un ser inexistente',h.line);}
const scan=(statements,fn=false)=>{for(const s of statements){if(s.t==='return'&&!fn)throw new Wan2Error('«devuelve» solo puede usarse dentro de una función',s.line);if(s.t==='declare'&&s.type&&!types.has(s.type))throw new Wan2Error(`Tipo desconocido: ${s.type}`,s.line);if(s.t==='if'){scan(s.body,fn);if(s.elseBody)scan(s.elseBody,fn);}if(s.t==='repeat')scan(s.body,fn);}};
scan(ast.main);for(const h of ast.handlers)scan(h.body);for(const fn of ast.functions)scan(fn.body,true);for(const e of ast.entities){if(e.constructor)scan(e.constructor.body,true);for(const fn of e.methods)scan(fn.body,true);}
}
export function isV2(source){return /(?:^|\n)\s*(?:chon\s|fijo\s|hacer\s|nace\s*\(|rasgo\s+\S+\s*:\s*\S+|repite\s|devuelve\b|sino\s*$)/mu.test(source);}
