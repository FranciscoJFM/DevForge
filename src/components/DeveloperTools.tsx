"use client";
import {useState} from 'react';import {Copy,Check,Shuffle,Braces,GitCompare} from 'lucide-react';
import ToolHelp, { HelpText } from './ToolHelp';

const developerExamples = {
    json: { instructions: 'Pega un objeto JSON y presiona Validar y formatear. Los nombres de las propiedades llevan comillas dobles.', example: '{"app":"DEVFORGE","version":1}', expected: '{\n  "app": "DEVFORGE",\n  "version": 1\n}' },
    uuid: { instructions: 'Presiona Generar UUID para crear un identificador distinto. Cada valor tiene el formato de este ejemplo.', example: 'crypto.randomUUID()', expected: '2c4b2251-d9a4-4a71-8b50-a9d75800e29c' },
    compare: { instructions: 'Carga los textos de ejemplo y revisa la línea 2. Cada columna conserva su propio texto.', example: 'Original: estado=pendiente\nModificado: estado=listo', expected: 'Línea 2\n- estado=pendiente\n+ estado=listo' },
    url: { instructions: 'Carga el ejemplo y pulsa Codificar. Para revertirlo, pega el resultado y pulsa Decodificar.', example: 'café & té', expected: 'caf%C3%A9%20%26%20t%C3%A9' },
};

export default function DeveloperTools(){const [tab,setTab]=useState<'json'|'uuid'|'compare'|'url'>('json');const [input,setInput]=useState('{"app":"DEVFORGE","version":1}');const [output,setOutput]=useState('');const [error,setError]=useState('');const [uuid,setUuid]=useState('');const [left,setLeft]=useState('');const [right,setRight]=useState('');const [copied,setCopied]=useState(false);
const [urlInput, setUrlInput] = useState('');
const [urlOutput, setUrlOutput] = useState('');
function convertUrl(decode: boolean) {
    try {
        setUrlOutput(decode ? decodeURIComponent(urlInput) : encodeURIComponent(urlInput));
        setError('');
    } catch {
        setUrlOutput('');
        setError('El texto contiene una secuencia que no se puede convertir.');
    }
}
const format=()=>{try{const val=JSON.parse(input);setOutput(JSON.stringify(val,null,2));setError('')}catch(e){setOutput('');setError(e instanceof Error?e.message:'JSON no válido')}};
const generate=()=>{const c=globalThis.crypto;if(!c?.randomUUID){setError('Este navegador necesita un contexto seguro (HTTPS o localhost) para generar UUID.');return}setError('');setUuid(c.randomUUID())};
const copy=async(s:string)=>{if(!s)return;try{await navigator.clipboard.writeText(s);setCopied(true);setTimeout(()=>setCopied(false),1500)}catch{setError('No fue posible copiar. Selecciona el texto manualmente.')}};
const example = developerExamples[tab];
function loadExample() {
    setError('');
    if (tab === 'json') {
        setInput(example.example);
        setOutput('');
    } else if (tab === 'compare') {
        setLeft('pedido=123\nestado=pendiente');
        setRight('pedido=123\nestado=listo');
    } else if (tab === 'url') {
        setUrlInput(example.example);
        setUrlOutput('');
    }
}

return <div className="panel p-5 md:p-7"><div className="flex flex-wrap gap-2 mb-7"><button onClick={()=>{setTab('json');setError('')}} className={tab==='json'?'btn-primary':'btn-secondary'}><Braces size={16}/> JSON</button><button onClick={()=>{setTab('uuid');setError('')}} className={tab==='uuid'?'btn-primary':'btn-secondary'}><Shuffle size={16}/> UUID</button><button onClick={()=>{setTab('compare');setError('')}} className={tab==='compare'?'btn-primary':'btn-secondary'}><GitCompare size={16}/> Comparador</button><button onClick={()=>{setTab('url');setError('')}} className={tab==='url'?'btn-primary':'btn-secondary'}>URL</button></div><div className="mb-5">
    <ToolHelp key={tab}>
        <p className="subtle">{example.instructions}</p>
        <p className="font-semibold">Ejemplo</p>
        <HelpText>{example.example}</HelpText>
        <p className="font-semibold">Resultado de ejemplo</p>
        <HelpText>{example.expected}</HelpText>
        {tab !== 'uuid' && <button type="button" className="btn-secondary text-sm" onClick={loadExample}>Cargar ejemplo</button>}
    </ToolHelp>
</div>{tab==='json'&&<div><h2 className="font-bold text-xl">Formateador y validador JSON</h2><p className="subtle text-sm mt-1 mb-4">El procesamiento ocurre en este navegador, sin enviar tus datos al servidor.</p><textarea aria-label="JSON de entrada" className="field min-h-[160px] font-mono text-sm" value={input} onChange={e=>setInput(e.target.value)}/><div className="flex gap-2 mt-4"><button className="btn-primary" onClick={format}>Validar y formatear</button><button className="btn-secondary" onClick={()=>copy(output)}><Copy size={16}/> Copiar</button></div>{output&&<pre className="mt-5 overflow-auto rounded-xl border border-[color:var(--line)] bg-[color:var(--well)] p-5 text-sm text-[color:var(--code)]">{output}</pre>}</div>}{tab==='uuid'&&<div><h2 className="font-bold text-xl">Generador UUID v4</h2><p className="subtle text-sm mt-2">Genera identificadores aleatorios con la API criptográfica del navegador.</p><div className="flex gap-3 mt-5 flex-wrap"><button className="btn-primary" onClick={generate}><Shuffle size={16}/> Generar UUID</button><button className="btn-secondary" onClick={()=>copy(uuid)}><Copy size={16}/> Copiar</button></div>{uuid&&<p className="bg-[color:var(--well)] border border-[color:var(--line)] rounded-xl p-4 mt-5 font-mono text-sm break-all">{uuid}</p>}</div>}{tab==='compare'&&<div><h2 className="font-bold text-xl">Comparador de textos</h2><p className="subtle text-sm mt-2 mb-4">Compara línea por línea. No es un algoritmo de diff avanzado.</p><div className="grid md:grid-cols-2 gap-4"><textarea aria-label="Texto original" placeholder="Texto original" className="field min-h-[180px] font-mono text-sm" value={left} onChange={e=>setLeft(e.target.value)}/><textarea aria-label="Texto modificado" placeholder="Texto modificado" className="field min-h-[180px] font-mono text-sm" value={right} onChange={e=>setRight(e.target.value)}/></div><p className="subtle mt-5 text-sm">{left===right?'Los textos son idénticos.':`Hay ${Math.max(left.split('\n').length,right.split('\n').length)} líneas para comparar (incluyendo líneas iguales).`}</p><div className="mt-4 space-y-2">{left!==right&&Array.from({length:Math.min(100,Math.max(left.split('\n').length,right.split('\n').length))},(_,i)=>({a:left.split('\n')[i]??'',b:right.split('\n')[i]??'',i})).filter(x=>x.a!==x.b).map(x=><div key={x.i} className="bg-[color:var(--well)] p-3 rounded-xl font-mono text-xs break-all"><span className="subtle">Línea {x.i+1}</span><p className="text-[color:var(--danger)] mt-2">- {x.a||'(vacía)'}</p><p className="text-[color:var(--success)] mt-1">+ {x.b||'(vacía)'}</p></div>)}</div>{Math.max(left.split('\n').length,right.split('\n').length)>100&&<p className="subtle text-xs mt-3">Vista limitada a las primeras 100 líneas.</p>}</div>}{tab === 'url' && (
    <div>
        <h2 className="text-xl font-bold">Codificador de componentes de URL</h2>
        <p className="subtle mb-4 mt-2">Convierte el valor de un parámetro de URL o recupera el texto original de una secuencia con porcentajes.</p>
        <textarea aria-label="Texto para convertir" className="field min-h-28 font-mono" value={urlInput} onChange={event => {
            setUrlInput(event.target.value);
            setUrlOutput('');
            setError('');
        }} />
        <div className="my-4 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => convertUrl(false)}>Codificar</button>
            <button className="btn-secondary" onClick={() => convertUrl(true)}>Decodificar</button>
            <button className="btn-secondary" disabled={!urlOutput} onClick={() => copy(urlOutput)}>Copiar resultado</button>
        </div>
        {urlOutput && <textarea aria-label="Resultado de la conversión" className="field min-h-28 font-mono" readOnly value={urlOutput} />}
    </div>
)}{error&&<p role="alert" className="text-[color:var(--danger)] mt-4 text-sm">{error}</p>}{copied&&<p role="status" className="text-[color:var(--success)] mt-4 text-sm flex gap-2"><Check size={16}/> Copiado</p>}</div>}
