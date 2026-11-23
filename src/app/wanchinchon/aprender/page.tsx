"use client";

import Link from 'next/link';
import { useState } from 'react';
import { wanchinchonLessons } from '@/lib/wanchinchonLessons';

export default function WanchinchonLearnPage() {
    const [selected, setSelected] = useState(0);
    const [code, setCode] = useState(wanchinchonLessons[0].code);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const lesson = wanchinchonLessons[selected];

    function choose(index: number) {
        setSelected(index);
        setCode(wanchinchonLessons[index].code);
        setResult('');
        setError('');
    }

    function execute() {
        setError('');
        setResult('');
        setBusy(true);
        try {
            const worker = new Worker('/wanchinchon/wan-worker.mjs', { type: 'module' });
            const timer = window.setTimeout(() => {
                worker.terminate();
                setBusy(false);
                setError('Tiempo de ejecución excedido (2 segundos).');
            }, 2000);
            worker.onmessage = event => {
                window.clearTimeout(timer);
                worker.terminate();
                setBusy(false);
                const data = event.data as {
                    ok: boolean;
                    result?: { messages: string[] };
                    error?: { message: string };
                };
                if (data.ok) setResult(data.result?.messages.join('\n') || '(Sin mensajes)');
                else setError(data.error?.message || 'No fue posible ejecutar el programa.');
            };
            worker.onerror = () => {
                window.clearTimeout(timer);
                worker.terminate();
                setBusy(false);
                setError('No fue posible cargar el motor de ejecución.');
            };
            worker.postMessage({ id: selected + 1, source: code, version: '0.2' });
        } catch {
            setBusy(false);
            setError('No fue posible iniciar el motor.');
        }
    }

    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro">
                <p className="hero-topic">Wanchinchon Academy</p>
                <h1 className="mt-3">Aprende Wanchinchon desde cero</h1>
                <p>Elige una lección, modifica el código y observa el resultado real del intérprete.</p>
            </header>
            <div className="mt-8 grid gap-5 lg:grid-cols-[14rem_1fr]">
                <nav className="panel h-fit p-3" aria-label="Lecciones">
                    {wanchinchonLessons.map((item, index) => (
                        <button key={item.slug} type="button" className="wanchinchon-lesson-link" aria-current={selected === index ? 'step' : undefined} onClick={() => choose(index)}>
                            <span>{String(item.number).padStart(2, '0')}</span>
                            <strong>{item.title}</strong>
                        </button>
                    ))}
                </nav>
                <section className="panel p-5 md:p-7">
                    <p className="mini-tag">Lección {lesson.number}</p>
                    <h2 className="mt-3 text-2xl font-bold">{lesson.title}</h2>
                    <p className="subtle mt-2">{lesson.summary}</p>
                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                        <div>
                            <label className="block font-bold" htmlFor="lesson-code">Código .wan</label>
                            <textarea id="lesson-code" className="field mt-2 min-h-[22rem] font-mono text-sm" value={code} onChange={event => setCode(event.target.value)} spellCheck={false} />
                            <button type="button" className="btn-primary mt-4" onClick={execute} disabled={busy}>{busy ? 'Ejecutando...' : 'Ejecutar lección'}</button>
                        </div>
                        <div>
                            <h3 className="font-bold">Qué significa</h3>
                            <ul className="subtle mt-3 list-disc space-y-2 pl-5">
                                {lesson.explanation.map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <h3 className="mt-5 font-bold">Consola</h3>
                            {error ? <p role="alert" className="mt-3 rounded-lg border border-[color:var(--danger)] p-4 text-[color:var(--danger)]">{error}</p> : <pre className="field mt-3 min-h-32 whitespace-pre-wrap text-sm" aria-live="polite"><code>{result || 'La salida aparecerá aquí.'}</code></pre>}
                            <p className="subtle mt-3 text-sm">Resultado esperado: <strong>{lesson.expected}</strong></p>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link className="btn-secondary" href="/wanchinchon/docs">Consultar documentación</Link>
                        <Link className="btn-primary" href="/wanchinchon/playground">Abrir playground</Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
