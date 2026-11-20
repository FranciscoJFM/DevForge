"use client";

import { useState } from 'react';
import TextResult from './TextResult';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const quote = (text: string) => "'" + text.replaceAll("'", "'\"'\"'") + "'";

export default function ApiRequestBuilder() {
    const [protocol, setProtocol] = useState('REST');
    const [method, setMethod] = useState('GET');
    const [output, setOutput] = useState<{ curl: string; fetch: string; docs: string }>();
    const [view, setView] = useState<'curl' | 'fetch' | 'docs'>('curl');
    const [error, setError] = useState('');
    const verb = protocol === 'SOAP' ? 'POST' : method;

    return (
        <section className="panel mt-8 p-6">
            <form className="space-y-4" onChange={() => { setOutput(undefined); setError(''); }} onSubmit={event => {
                event.preventDefault();
                const fields = new FormData(event.currentTarget);
                try {
                    const url = new URL(String(fields.get('url')).trim());
                    if (url.protocol !== 'https:' || url.username || url.password || url.hash) throw Error('Usa HTTPS sin credenciales ni fragmento.');
                    const body = String(fields.get('body') ?? '').trim();
                    if (body && protocol === 'REST') JSON.parse(body);
                    if (body && protocol === 'SOAP') {
                        if (/<!\s*(DOCTYPE|ENTITY)\b/i.test(body)) throw Error('Quita las declaraciones DTD y de entidades.');
                        const xml = new DOMParser().parseFromString(body, 'application/xml');
                        const root = xml.documentElement;
                        if (root.localName !== 'Envelope' || root.namespaceURI !== 'http://schemas.xmlsoap.org/soap/envelope/' || xml.getElementsByTagName('parsererror').length) throw Error('Usa un sobre XML válido de SOAP 1.1.');
                    }
                    const headers: Record<string, string> = protocol === 'SOAP'
                        ? { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: JSON.stringify(String(fields.get('action')).trim()) }
                        : { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) };
                    const options = { method: verb, headers, ...(body ? { body } : {}) };
                    const curl = ['curl', '--request ' + verb, ...Object.entries(headers).map(([key, value]) => '--header ' + quote(key + ': ' + value)), ...(body ? ['--data-raw ' + quote(body)] : []), quote(url.href)].join(' ');
                    setOutput({
                        curl,
                        fetch: 'const response = await fetch(' + JSON.stringify(url.href) + ', ' + JSON.stringify(options, null, 2) + ');\nconst payload = await response.text();\nif (!response.ok) throw new Error("HTTP " + response.status);',
                        docs: '# Solicitud ' + protocol + '\n\nMétodo: ' + verb + '\nURL: ' + url.href + '\n\n## Encabezados\n\n' + Object.entries(headers).map(([key, value]) => '- ' + key + ': ' + value).join('\n') + '\n\n## Cuerpo\n\n' + (body ? body.split('\n').map(line => '    ' + line).join('\n') : 'Sin cuerpo.') + '\n\n## Respuestas esperadas\n\nDocumenta los códigos HTTP, errores y casos de prueba.\n',
                    });
                } catch (cause) {
                    setOutput(undefined);
                    setError(cause instanceof SyntaxError ? 'El cuerpo JSON no es válido.' : cause instanceof Error ? cause.message : 'Revisa los datos.');
                }
            }}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label>Protocolo<select className="field mt-2" value={protocol} onChange={event => setProtocol(event.target.value)}><option>REST</option><option>SOAP</option></select></label>
                    {protocol === 'REST' && <label>Método<select className="field mt-2" value={method} onChange={event => setMethod(event.target.value)}>{methods.map(item => <option key={item}>{item}</option>)}</select></label>}
                </div>
                <label className="block">URL de ejemplo<input name="url" type="url" className="field mt-2" defaultValue="https://example.com/api/items" required /></label>
                {protocol === 'SOAP' && <label className="block">SOAPAction<input name="action" className="field mt-2" defaultValue="urn:ejemplo:Consultar" /></label>}
                {verb !== 'GET' && <label className="block">{protocol === 'SOAP' ? 'Sobre SOAP 1.1' : 'Cuerpo JSON (opcional)'}
                    <textarea key={protocol} name="body" required={protocol === 'SOAP'} className="field mt-2 min-h-36 font-mono"
                        defaultValue={protocol === 'SOAP' ? '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n  <s:Body><m:Consultar xmlns:m="urn:ejemplo"/></s:Body>\n</s:Envelope>' : ''} />
                </label>}
                <button className="btn-primary" type="submit">Generar ejemplos</button>
                {error && <p role="alert" className="text-red-200">{error}</p>}
            </form>
            {output && <div className="mt-5">
                <label>Formato<select className="field mt-2" value={view} onChange={event => setView(event.target.value as typeof view)}>
                    <option value="curl">cURL para Bash</option><option value="fetch">JavaScript fetch</option><option value="docs">Documentación Markdown</option>
                </select></label>
                <TextResult key={view} value={output[view]} filename={{ curl: 'solicitud.sh', fetch: 'solicitud.js', docs: 'integracion.md' }[view]} />
            </div>}
        </section>
    );
}
