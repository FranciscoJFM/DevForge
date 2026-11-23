"use client";

import { useEffect, useRef, useState } from 'react';
import { wanchinchonLessons } from '@/lib/wanchinchonLessons';

type WanResult = {
    ok: true;
    version: '0.1' | '0.2';
    result: {
        world: string;
        messages: string[];
        state: Record<string, unknown>;
        variables?: Record<string, unknown>;
        trace: { type: string; [key: string]: unknown }[];
    };
};

type WanError = {
    ok: false;
    error: { message: string; line?: number | null; column?: number | null };
};

const storageKey = 'devforge:wanchinchon:programs:v1';

function cleanName(value: string) {
    return (value || 'mi-programa')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 55) || 'mi-programa';
}

function explainError(message: string) {
    if (/Faltan \d+.*fin|fin.*bloque|sin bloque/u.test(message)) return 'Revisa si cerraste mundo, ser, función, condición o ciclo con fin.';
    if (/tipo|numero|texto|logico/u.test(message)) return 'Comprueba que el valor coincida con el tipo declarado.';
    if (/símbolo|variable|nombre|definid/u.test(message)) return 'Declara el elemento antes de usarlo y revisa mayúsculas y acentos.';
    if (/límite|ejecución|ciclo/u.test(message)) return 'Reduce repeticiones o sucesos; puede existir un ciclo.';
    return 'Revisa la línea indicada y compara la instrucción con la documentación.';
}

type SavedProject = { name: string; code: string; version: '0.1' | '0.2'; updatedAt: string };

function readSavedProjects(): SavedProject[] {
    if (typeof window === 'undefined') return [];
    try {
        const value = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as unknown;
        if (!Array.isArray(value)) return [];
        return value.filter((item): item is SavedProject =>
            typeof item === 'object' && item !== null
            && typeof (item as { code?: unknown }).code === 'string').slice(0, 20);
    } catch {
        return [];
    }
}

export default function WanchinchonWorkerPlayground({
    initialCode,
    lessonName,
}: {
    initialCode?: string;
    lessonName?: string;
}) {
    const [code, setCode] = useState(initialCode ?? wanchinchonLessons[0].code);
    const [version, setVersion] = useState<'0.1' | '0.2'>('0.2');
    const [name, setName] = useState(lessonName ?? 'mi-primer-programa');
    const [result, setResult] = useState<WanResult | null>(null);
    const [error, setError] = useState<WanError['error'] | null>(null);
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState<SavedProject[]>(readSavedProjects);
    const workerRef = useRef<Worker | null>(null);
    const timerRef = useRef<number | null>(null);
    const requestRef = useRef(0);

    useEffect(() => () => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        workerRef.current?.terminate();
        workerRef.current = null;
    }, []);

    function stop() {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        workerRef.current?.terminate();
        workerRef.current = null;
        setBusy(false);
    }

    function execute() {
        stop();
        setBusy(true);
        setResult(null);
        setError(null);
        setNote('');
        const request = ++requestRef.current;

        try {
            const worker = new Worker('/wanchinchon/wan-worker.mjs', { type: 'module' });
            workerRef.current = worker;
            timerRef.current = window.setTimeout(() => {
                if (requestRef.current !== request) return;
                stop();
                setError({ message: 'Tiempo de ejecución excedido (2 segundos)', line: null });
            }, 2000);
            worker.onmessage = event => {
                const data = event.data as WanResult | WanError;
                if (data && 'ok' in data && data.ok) {
                    if (requestRef.current !== request) return;
                    stop();
                    setResult(data);
                    return;
                }
                if (requestRef.current !== request) return;
                stop();
                setError((data as WanError).error);
            };
            worker.onerror = () => {
                if (requestRef.current !== request) return;
                stop();
                setError({ message: 'No fue posible cargar el motor de ejecución.', line: null });
            };
            worker.postMessage({ id: request, source: code, version });
        } catch (nextError) {
            stop();
            setError({ message: nextError instanceof Error ? nextError.message : 'No se pudo iniciar el motor.', line: null });
        }
    }

    function save() {
        if (!name.trim()) {
            setNote('Escribe un nombre antes de guardar.');
            return;
        }
        const entry = { name: cleanName(name), code, version, updatedAt: new Date().toISOString() };
        const next = [entry, ...saved.filter(item => item.name !== entry.name)].slice(0, 20);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
            setSaved(next);
            setNote('Guardado en este navegador.');
        } catch {
            setNote('No se pudo guardar: almacenamiento bloqueado o lleno.');
        }
    }

    function exportProgram() {
        const blob = new Blob([code + '\n'], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = cleanName(name) + '.wan';
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function restore(projectName: string) {
        const project = saved.find(item => item.name === projectName);
        if (!project) return;
        stop();
        setCode(project.code);
        setVersion(project.version);
        setName(project.name);
        setResult(null);
        setError(null);
        setNote('Programa recuperado.');
    }

    function remove() {
        const next = saved.filter(item => item.name !== cleanName(name));
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
            setSaved(next);
            setNote('Programa local eliminado.');
        } catch {
            setNote('No se pudo actualizar el almacenamiento.');
        }
    }

    return (
        <section className="panel p-5 md:p-7" aria-label="Playground Wanchinchon">
            <div className="mt-2 grid gap-3 md:grid-cols-3">
                <label><span className="mb-2 block font-bold">Proyecto</span><input className="field" value={name} maxLength={55} onChange={event => setName(event.target.value)} /></label>
                <label><span className="mb-2 block font-bold">Versión</span><select className="field" value={version} onChange={event => setVersion(event.target.value as '0.1' | '0.2')}><option value="0.2">0.2 actual</option><option value="0.1">0.1 legacy</option></select></label>
                <label><span className="mb-2 block font-bold">Mis programas</span><select className="field" value="" onChange={event => restore(event.target.value)}><option value="">Seleccionar...</option>{saved.map(project => <option key={project.name} value={project.name}>{project.name}</option>)}</select></label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={execute} disabled={busy}>{busy ? 'Ejecutando...' : 'Ejecutar programa'}</button>
                <button type="button" className="btn-secondary" onClick={stop} disabled={!busy}>Detener</button>
                <button type="button" className="btn-secondary" onClick={save}>Guardar local</button>
                <button type="button" className="btn-secondary" onClick={exportProgram}>Exportar .wan</button>
                <button type="button" className="btn-secondary" onClick={remove}>Eliminar guardado</button>
            </div>
            <label className="mt-5 block" htmlFor="wan-source"><span className="mb-2 block font-bold">Código fuente</span></label>
            <textarea id="wan-source" className="field min-h-[28rem] font-mono text-sm" spellCheck={false} value={code} onChange={event => { setCode(event.target.value); setResult(null); setError(null); }} />
            {note && <p role="status" className="subtle mt-3">{note}</p>}
            {error && <section className="mt-5 rounded-xl border border-[color:var(--danger)] p-5" role="alert">
                <h3 className="font-bold">Error de Wanchinchon</h3>
                <p className="mt-2">{error.message}</p>
                {error.line && <p>Línea {error.line}{error.column ? `, columna ${error.column}` : ''}</p>}
                <p className="subtle mt-3"><strong>Cómo corregirlo:</strong> {explainError(error.message)}</p>
            </section>}
            {result && <div className="mt-5 grid gap-4 lg:grid-cols-2" aria-live="polite">
                <section><h3 className="font-bold">Consola</h3><p className="subtle mt-1">Motor {result.version} · Mundo {result.result.world}</p><pre className="field mt-3 min-h-32 whitespace-pre-wrap text-sm"><code>{result.result.messages.length ? result.result.messages.join('\n') : '(No hay mensajes)'}</code></pre></section>
                <section><h3 className="font-bold">Estado final</h3><pre className="field mt-3 max-h-64 overflow-auto text-sm"><code>{JSON.stringify({ seres: result.result.state, variables: result.result.variables ?? {} }, null, 2)}</code></pre></section>
                <section className="lg:col-span-2"><h3 className="font-bold">Sucesos y traza</h3><pre className="field mt-3 max-h-96 overflow-auto text-sm"><code>{JSON.stringify(result.result.trace.slice(0, 120), null, 2)}</code></pre></section>
            </div>}
            <p className="subtle mt-5 text-sm">Ejecutado en Web Worker con límites de tamaño, pasos, sucesos y 2 segundos. No es un sandbox certificado.</p>
        </section>
    );
}
