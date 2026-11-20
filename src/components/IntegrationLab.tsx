"use client";

import { useState } from 'react';
import Link from 'next/link';
import { downloadText } from '@/lib/localDownload';
import { initialRecords, initialInventoryItem, inventoryPath, openApiContract, operations, simulateFailure, simulateRest, simulateSoap, soapExample, statusLabel, type LabResponse, type Scenario } from '@/lib/integrationLab';
import { clientCode } from '@/lib/integrationClient';
import TextResult from './TextResult';

const scenarios: { value: Scenario; label: string }[] = [
    { value: 'normal', label: 'Respuesta normal' },
    { value: 'unauthorized', label: '401 · credencial vencida' },
    { value: 'rate-limited', label: '429 · límite de solicitudes' },
    { value: 'unavailable', label: '503 · servicio ocupado' },
];

function displayBody(response: LabResponse) {
    if (response.body === undefined) return 'Sin cuerpo';
    return response.xml ? String(response.body) : JSON.stringify(response.body, null, 2);
}

export default function IntegrationLab() {
    const [protocol, setProtocol] = useState<'rest' | 'soap'>('rest');
    const [index, setIndex] = useState(0);
    const [id, setId] = useState('1');
    const [draft, setDraft] = useState(operations[0].body ?? '');
    const [soapXml, setSoapXml] = useState(soapExample);
    const [scenario, setScenario] = useState<Scenario>('normal');
    const [records, setRecords] = useState(initialRecords);
    const [inventoryItem, setInventoryItem] = useState(initialInventoryItem);
    const [nextId, setNextId] = useState(3);
    const [result, setResult] = useState<{ response: LabResponse; elapsed: number }>();
    const [format, setFormat] = useState('fetch');
    const operation = operations[index];
    const soap = protocol === 'soap';
    const method = soap ? 'POST' : operation.method;
    const path = soap ? '/calculator' : operation.path.replace(/\{\w+\}/, () => encodeURIComponent(id));
    const payload = soap ? soapXml : operation.body ? draft : '';

    function selectOperation(next: number) {
        const item = operations[next];
        setIndex(next);
        setId(item.path === inventoryPath ? initialInventoryItem.sku : '1');
        setDraft(item.body ?? '');
        setResult(undefined);
    }

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-3">
                <button type="button" aria-pressed={!soap} className={soap ? 'btn-secondary' : 'btn-primary'} onClick={() => { setProtocol('rest'); setResult(undefined); }}>REST</button>
                <button type="button" aria-pressed={soap} className={soap ? 'btn-primary' : 'btn-secondary'} onClick={() => { setProtocol('soap'); setResult(undefined); }}>SOAP 1.1</button>
                <button type="button" className="btn-secondary" onClick={() => downloadText('devforge-openapi.json', openApiContract(), 'application/json')}>Descargar OpenAPI 3.1</button>
            </div>
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(15rem,1fr)_2fr]">
                <section className="panel p-5" aria-label="Operaciones">
                    <h2 className="mb-4 text-lg font-bold">Operaciones</h2>
                    {soap ? <p className="rounded bg-[color:var(--surface-raised)] p-3"><strong>POST</strong> <code>/calculator</code><span className="block text-sm subtle">Operación Add</span></p>
                        : <div className="space-y-2">{operations.map((item, itemIndex) => (
                            <button key={item.method + item.path} type="button" aria-pressed={index === itemIndex}
                                className={('block w-full rounded-lg border p-3 text-left ') + (index === itemIndex ? 'border-[color:var(--accent)] bg-[color:var(--surface-raised)]' : 'border-[color:var(--input-line)]')}
                                onClick={() => selectOperation(itemIndex)}>
                                <strong className="mr-2 text-[color:var(--accent)]">{item.method}</strong><code className="break-all text-sm">{item.path}</code>
                                <span className="subtle block text-sm">{item.title}</span>
                            </button>
                        ))}</div>}
                </section>
                <section className="panel min-w-0 p-5" aria-label="Solicitud y respuesta">
                    <h2 className="text-xl font-bold">{soap ? 'Sumar con SOAP' : operation.title}</h2>
                    <p className="subtle mt-2"><code>{method} {path}</code></p>
                    <form className="mt-5 space-y-4" onSubmit={event => {
                        event.preventDefault();
                        const start = performance.now();
                        const failure = soap ? undefined : simulateFailure(scenario);
                        let response;
                        if (soap || failure) {
                            response = failure ?? simulateSoap(soapXml);
                        } else {
                            const next = simulateRest(operation, id.trim(), draft, records, nextId, inventoryItem);
                            response = next.response;
                            setRecords(next.records);
                            setInventoryItem(next.inventoryItem);
                            if (response.status === 201) setNextId(nextId + 1);
                        }
                        setResult({ response, elapsed: performance.now() - start });
                    }}>
                        {!soap && operation.path.includes('{') && <label className="block">{operation.path === inventoryPath ? 'SKU del producto' : 'Identificador'}<input className="field mt-2" required value={id} maxLength={40} onChange={event => { setId(event.target.value); setResult(undefined); }} /></label>}
                        {!soap && <label className="block">Escenario de respuesta<select className="field mt-2" value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setResult(undefined); }}>
                            {scenarios.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select></label>}
                        {(soap || operation.body) && <label className="block">{soap ? 'Sobre XML' : 'Cuerpo JSON'}
                            <textarea className="field mt-2 min-h-36 font-mono text-sm" value={payload} maxLength={12000} onChange={event => {
                                if (soap) setSoapXml(event.target.value); else setDraft(event.target.value);
                                setResult(undefined);
                            }} />
                        </label>}
                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className="btn-primary">Simular petición</button>
                            <button type="button" className="btn-secondary" onClick={() => {
                                setRecords(initialRecords);
                                setInventoryItem(initialInventoryItem);
                                setNextId(3);
                                setScenario('normal');
                                setSoapXml(soapExample);
                                selectOperation(0);
                            }}>Restaurar datos</button>
                        </div>
                    </form>
                    {result && <div className="mt-6 border-t border-[color:var(--input-line)] pt-4">
                        <p role="status" className="font-semibold">{result.response.status} {statusLabel[result.response.status]} <span className="subtle text-sm">· Simulado · {result.elapsed.toFixed(2)} ms locales</span></p>
                        {result.response.headers && <pre aria-label="Encabezados de respuesta" className="subtle mt-2 overflow-auto text-sm">{Object.entries(result.response.headers).map(([key, value]) => key + ': ' + value).join('\n')}</pre>}
                        <pre aria-label="Cuerpo de respuesta" className="field mt-3 overflow-auto whitespace-pre-wrap break-words">{displayBody(result.response)}</pre>
                        <button type="button" className="btn-secondary mt-3" onClick={() => {
                            const block = (value: string) => value.split('\n').map(line => '    ' + line).join('\n');
                            downloadText('practica-integracion.md', '# Práctica de integración\n\nMétodo y ruta: ' + method + ' ' + path
                                + '\n\n## Solicitud\n\n' + block(payload || 'Sin cuerpo')
                                + '\n\n## Respuesta simulada\n\nEstado: ' + result.response.status
                                + '\n\n' + block(displayBody(result.response)) + '\n');
                        }}>Descargar práctica Markdown</button>
                    </div>}
                </section>
            </div>
            {!soap && <Link className="btn-secondary" href={'/documentos?plantilla=qa&metodo=' + method}>Preparar casos de prueba de esta operación</Link>}
            <section className="panel p-5">
                <h2 className="text-xl font-bold">Consumir esta operación desde tu código</h2>
                <p className="subtle mt-2">Usa el ejemplo con tu servicio autorizado. Los clientes JavaScript y cURL usan un dominio reservado. El ejemplo Apex requiere una Named Credential llamada DevForgeDemo. Los clientes nativos de ejemplo codifican el cuerpo en Base64 para conservar exactamente los caracteres de la solicitud.</p>
                <label className="mt-4 block">Cliente<select value={format} className="field mt-2" onChange={event => setFormat(event.target.value)}>
                    <option value="fetch">JavaScript y TypeScript</option><option value="curl">cURL para Bash</option><option value="apex">Salesforce Apex</option>
                    <option value="kotlin">Android con Kotlin y OkHttp</option><option value="java">Java 11+</option><option value="swift">Swift</option><option value="python">Python con requests</option><option value="ruby">Ruby</option>
                </select></label>
                <TextResult key={format + method + path} value={clientCode(format, method, path, payload, soap)} filename={({ curl: 'solicitud.sh', apex: 'callout.apex', kotlin: 'Solicitud.kt', java: 'Solicitud.java', swift: 'Solicitud.swift', python: 'solicitud.py', ruby: 'solicitud.rb' } as Record<string, string>)[format] ?? 'solicitud.js'} />
                <Link href="/ejemplos" className="btn-secondary mt-3">Ver clientes Kotlin, Java, Swift, Python y Ruby</Link>
            </section>
        </div>
    );
}
