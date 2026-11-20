"use client";

import { useEffect, useRef, useState } from 'react';
import TextResult from './TextResult';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;
type Method = (typeof methods)[number];
const posts = 'https://jsonplaceholder.typicode.com/posts';
const postBody = JSON.stringify({ title: 'Práctica DevForge', body: 'Contenido ficticio', userId: 1 }, null, 2);
const presets: { label: string; url: string; method: Method; body?: string }[] = [
    { label: 'JSONPlaceholder · listar publicaciones', url: posts, method: 'GET' },
    { label: 'JSONPlaceholder · crear publicación', url: posts, method: 'POST', body: postBody },
    { label: 'JSONPlaceholder · reemplazar publicación', url: posts + '/1', method: 'PUT', body: postBody },
    { label: 'JSONPlaceholder · cambiar título', url: posts + '/1', method: 'PATCH', body: '{\n  "title": "Título de prueba"\n}' },
    { label: 'JSONPlaceholder · borrar publicación', url: posts + '/1', method: 'DELETE' },
    { label: 'PokéAPI · consultar Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu', method: 'GET' },
];
const MAX_RESPONSE_BYTES = 256 * 1024;

type ResponseView = { status: number; statusText: string; ms: number; headers: [string, string][]; body: string; truncated: boolean };

async function readResponse(response: Response) {
    if (!response.body) return { body: '', truncated: false };
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let remaining = MAX_RESPONSE_BYTES;
    let body = '';
    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) return { body: body + decoder.decode(), truncated: false };
            const part = value.subarray(0, remaining);
            body += decoder.decode(part, { stream: true });
            remaining -= part.byteLength;
            if (part.byteLength < value.byteLength) {
                await reader.cancel();
                return { body: body + decoder.decode(), truncated: true };
            }
        }
    } finally {
        reader.releaseLock();
    }
}

export default function LiveApiClient() {
    const [preset, setPreset] = useState('0');
    const [url, setUrl] = useState(presets[0].url);
    const [method, setMethod] = useState<Method>('GET');
    const [body, setBody] = useState('');
    const [format, setFormat] = useState('json');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<ResponseView>();
    const current = useRef<AbortController>(null);
    const acceptsBody = method !== 'GET' && method !== 'HEAD';

    useEffect(() => () => current.current?.abort(), []);

    return <section className="panel mt-6 p-5 md:p-7" aria-labelledby="live-heading">
        <h2 id="live-heading" className="section-title">Cliente HTTP</h2>
        <p className="subtle mt-3 max-w-3xl">La solicitud sale de tu navegador. El servidor debe permitir el acceso mediante CORS. Prueba cambios o borrados en una API de práctica o en un entorno donde tengas autorización.</p>
        <form className="mt-5 space-y-4" onSubmit={async event => {
            event.preventDefault();
            if (current.current) return;
            setResult(undefined);
            setError('');
            const endpoint = URL.canParse(url) ? new URL(url) : null;
            if (!endpoint || !['https:', 'http:'].includes(endpoint.protocol) || endpoint.username || endpoint.password || endpoint.hash) {
                setError('Introduce una URL HTTP o HTTPS sin credenciales ni fragmento.');
                return;
            }
            const payload = acceptsBody && body.trim() ? body : undefined;
            if (payload && format === 'json') {
                try { JSON.parse(payload); } catch { setError('El cuerpo no es JSON válido. Revísalo o cambia el formato.'); return; }
            }
            const controller = new AbortController();
            current.current = controller;
            setBusy(true);
            const start = performance.now();
            const deadline = setTimeout(() => controller.abort('timeout'), 12000);
            try {
                const response = await fetch(endpoint, {
                    method,
                    credentials: 'omit',
                    mode: 'cors',
                    signal: controller.signal,
                    headers: { Accept: 'application/json, application/xml, text/plain, */*', ...(payload ? {
                        'Content-Type': format === 'json' ? 'application/json' : format === 'xml' ? 'text/xml; charset=utf-8' : 'text/plain; charset=utf-8',
                    } : {}) },
                    ...(payload ? { body: payload } : {}),
                });
                const { body: responseText, truncated } = await readResponse(response);
                let text = responseText;
                if (!truncated && text && response.headers.get('content-type')?.includes('json')) {
                    try { text = JSON.stringify(JSON.parse(text), null, 2); } catch { /* Keep the original text. */ }
                }
                setResult({ status: response.status, statusText: response.statusText, ms: Math.round(performance.now() - start), headers: [...response.headers.entries()], body: text, truncated });
            } catch {
                setError(controller.signal.aborted
                    ? controller.signal.reason === 'timeout' ? 'La petición superó los 12 segundos.' : 'Petición cancelada.'
                    : 'No se pudo leer la respuesta. Revisa la URL, la conexión, el acceso HTTP desde HTTPS y los permisos CORS de la API.');
            } finally {
                clearTimeout(deadline);
                current.current = null;
                setBusy(false);
            }
        }}>
            <label className="block font-semibold">Cargar ejemplo
                <select className="field mt-2" value={preset} disabled={busy} onChange={event => {
                    const next = event.target.value;
                    setPreset(next);
                    if (!next) return;
                    const sample = presets[Number(next)];
                    setUrl(sample.url);
                    setMethod(sample.method);
                    setBody(sample.body ?? '');
                    setFormat('json');
                    setResult(undefined);
                    setError('');
                }}>
                    <option value="">Petición personalizada</option>
                    {presets.map((sample, index) => <option value={index} key={sample.label}>{sample.label}</option>)}
                </select>
            </label>
            <div className="grid gap-3 md:grid-cols-[8rem_minmax(0,1fr)]">
                <label className="font-semibold">Método<select className="field mt-2" disabled={busy} value={method}
                    onChange={event => { setMethod(event.target.value as Method); setPreset(''); }}>{methods.map(verb => <option key={verb}>{verb}</option>)}</select></label>
                <label className="font-semibold">URL<input className="field mt-2 font-mono text-sm" type="url" required maxLength={4096} disabled={busy} value={url}
                    placeholder="https://api.example.com/items" onChange={event => { setUrl(event.target.value); setPreset(''); }} /></label>
            </div>
            {acceptsBody && <>
                <label className="block font-semibold">Formato del cuerpo<select className="field mt-2" disabled={busy} value={format}
                    onChange={event => { setFormat(event.target.value); setPreset(''); }}>
                    <option value="json">JSON</option><option value="xml">XML</option><option value="text">Texto</option>
                </select></label>
                <label className="block font-semibold">Cuerpo opcional<textarea className="field mt-2 min-h-36 font-mono text-sm" disabled={busy} value={body} maxLength={65536}
                    onChange={event => { setBody(event.target.value); setPreset(''); }} /></label>
            </>}
            <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Enviando…' : 'Enviar petición'}</button>
                {busy && <button type="button" className="btn-secondary" onClick={() => current.current?.abort('cancelled')}>Cancelar</button>}
            </div>
            {error && <p role="alert" className="tool-error">{error}</p>}
        </form>
        {result && <div className="mt-6 border-t border-[color:var(--line)] pt-4">
            <p role="status" className="font-bold">{result.status} {result.statusText} <span className="subtle text-sm">· {result.ms} ms</span></p>
            {result.headers.length > 0 && <details className="mt-4">
                <summary className="cursor-pointer font-semibold">Encabezados visibles</summary>
                <pre className="field mt-2 overflow-auto text-sm">{result.headers.map(([key, value]) => key + ': ' + value).join('\n')}</pre>
            </details>}
            {result.truncated && <p className="subtle mt-3">Vista limitada a los primeros 256 KB de la respuesta.</p>}
            {result.body ? <TextResult key={result.ms + ':' + result.status} value={result.body} filename="respuesta.txt" /> : <p className="subtle mt-3">Sin cuerpo de respuesta.</p>}
        </div>}
    </section>;
}
