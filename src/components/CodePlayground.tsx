"use client";

import { useEffect, useRef, useState } from 'react';
import { downloadText } from '@/lib/localDownload';

const exercises = [
    { name: 'Editor libre', description: 'Escribe JavaScript y usa console.log para ver el resultado.', code: 'const tasks = ["documentar", "probar", "liberar"];\nconsole.log(tasks.join(" → "));', cases: [] },
    { name: 'Inicial · Normalizar una referencia', description: 'Escribe solve(text). Quita espacios al inicio y al final, y devuelve el texto en mayúsculas.', code: 'function solve(text) {\n    return text;\n}', cases: [
        { label: 'Quita espacios externos', args: ['  REF-100  '], expected: 'REF-100' },
        { label: 'Convierte a mayúsculas', args: ['ref-200'], expected: 'REF-200' },
        { label: 'Acepta texto vacío', args: [''], expected: '' },
    ] },
    { name: 'Intermedio · Total de un pedido', description: 'Escribe solve(items). Devuelve la suma de cantidad × precioEnCentavos. Una lista vacía devuelve cero.', code: 'function solve(items) {\n    return 0;\n}', cases: [
        { label: 'Pedido vacío', args: [[]], expected: 0 },
        { label: 'Multiplica cantidad por precio', args: [[{ cantidad: 2, precioEnCentavos: 125 }]], expected: 250 },
        { label: 'Suma varios conceptos', args: [[{ cantidad: 2, precioEnCentavos: 100 }, { cantidad: 3, precioEnCentavos: 499 }]], expected: 1697 },
    ] },
];

type RunResult = { output: string[]; results: { label: string; pass: boolean }[]; error?: string };

export default function CodePlayground() {
    const [selected, setSelected] = useState(0);
    const [code, setCode] = useState(exercises[0].code);
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<RunResult>();
    const runner = useRef<HTMLIFrameElement>(null);
    const runId = useRef('');
    const deadline = useRef<ReturnType<typeof setTimeout> | null>(null);
    const exercise = exercises[selected];

    useEffect(() => {
        function onResult(event: MessageEvent) {
            if (event.source !== runner.current?.contentWindow) return;
            if (event.data?.type === 'devforge-ready') {
                setReady(true);
                return;
            }
            if (event.data?.type !== 'devforge-result'
                || !runId.current || event.data.id !== runId.current) return;
            if (deadline.current !== null) clearTimeout(deadline.current);
            runId.current = '';
            setBusy(false);
            setResult(event.data);
        }
        window.addEventListener('message', onResult);
        return () => {
            window.removeEventListener('message', onResult);
            if (deadline.current !== null) clearTimeout(deadline.current);
        };
    }, []);

    useEffect(() => {
        if (ready) return;
        const ping = () => runner.current?.contentWindow?.postMessage({ type: 'devforge-ping' }, '*');
        ping();
        const interval = setInterval(ping, 150);
        return () => clearInterval(interval);
    }, [ready]);

    function run() {
        const target = runner.current?.contentWindow;
        if (!target) return;
        setResult(undefined);
        setBusy(true);
        const id = crypto.randomUUID();
        runId.current = id;
        target.postMessage({ type: 'devforge-run', id, code, cases: exercise.cases }, '*');
        deadline.current = setTimeout(() => {
            runId.current = '';
            setBusy(false);
            setResult({ output: [], results: [], error: 'El ejecutor no respondió. Recarga la página si el problema continúa.' });
        }, 3500);
    }

    return <section className="panel mt-8 p-6">
        <label className="block font-semibold">Modo de práctica<select value={selected} className="field mt-2" disabled={busy} onChange={event => {
            const next = Number(event.target.value);
            setSelected(next);
            setCode(exercises[next].code);
            setResult(undefined);
        }}>{exercises.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
        <p className="subtle mt-3">{exercise.description}</p>
        <label className="mt-4 block font-semibold">Código JavaScript<textarea className="field mt-2 min-h-56 font-mono" value={code}
            disabled={busy} maxLength={15000} spellCheck={false} onChange={event => setCode(event.target.value)} /></label>
        <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary disabled:opacity-50" disabled={!ready || busy || !code.trim()} onClick={run}>
                {busy ? 'Ejecutando…' : exercise.cases.length ? 'Ejecutar pruebas' : 'Ejecutar código'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => downloadText('practica.js', code)}>Descargar código</button>
        </div>
        <iframe title="Ejecutor aislado de JavaScript" sandbox="allow-scripts" src="/code-runner.html" hidden ref={runner} />
        {result && <div className="mt-5 space-y-2" aria-live="polite">
            <h3 className="font-bold">Resultado</h3>
            {result.error && <p className="text-red-200">{result.error}</p>}
            {result.results.length > 0 && <ul>{result.results.map(test => <li key={test.label}>{test.pass ? 'Pasó' : 'Falló'} · {test.label}</li>)}</ul>}
            {result.output.length > 0 && <pre className="field max-h-72 overflow-auto whitespace-pre-wrap">{result.output.join('\n')}</pre>}
            {!result.error && result.results.length === 0 && result.output.length === 0 && <p className="subtle">El código terminó sin salida de consola.</p>}
        </div>}
    </section>;
}
