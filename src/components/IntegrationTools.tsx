"use client";

import { useState } from 'react';
import ToolHelp, { HelpText } from './ToolHelp';
import { examples as codeExamples } from '@/lib/codeExamples';
import { clientCode } from '@/lib/integrationClient';
import { toolStacks, type ToolStack } from '@/lib/toolStacks';

const examples = {
    soql: 'SELECT Id, Name FROM Account ORDER BY Name LIMIT 10',
    sql: 'customers\nid, name',
    xml: '<request><message>Hola</message></request>',
    soap: '<m:Consultar xmlns:m="urn:ejemplo"><m:Id>123</m:Id></m:Consultar>',
    rest: 'https://example.com/api/items',
    class: 'CuentaServicio',
};

type Mode = keyof typeof examples;

const tools: { id: Mode; title: string; help: string; inputLabel: string }[] = [
    { id: 'soql', title: 'SOQL a REST', help: 'Pega una consulta SOQL. Obtendrás una ruta relativa con el parámetro q codificado. Sustituye XX.X por la versión de API de tu org.', inputLabel: 'Consulta SOQL' },
    { id: 'sql', title: 'SQL SELECT', help: 'Escribe una tabla en la primera línea y las columnas separadas por comas en la segunda. Admite identificadores simples.', inputLabel: 'Tabla y columnas' },
    { id: 'xml', title: 'Validar XML', help: 'Comprueba si el XML está bien formado y obtén una copia serializada. La herramienta comprueba la sintaxis XML.', inputLabel: 'Documento XML' },
    { id: 'soap', title: 'Sobre SOAP', help: 'Envuelve una operación XML en un sobre SOAP 1.1. Usa el namespace que define el WSDL del servicio.', inputLabel: 'Operación XML' },
    { id: 'rest', title: 'Código REST', help: 'Genera un GET con verificación del estado HTTP para la tecnología elegida. Usa una URL de ejemplo sin credenciales.', inputLabel: 'URL HTTPS' },
    { id: 'class', title: 'Clase base', help: 'Genera una clase con constructor y método para la tecnología elegida.', inputLabel: 'Nombre de clase' },
];

function parseXml(input: string) {
    if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(input)) {
        throw new Error('Quita las declaraciones DTD y de entidades antes de continuar.');
    }
    const doc = new DOMParser().parseFromString(input, 'application/xml');
    const parserErrors = ['http://www.mozilla.org/newlayout/xml/parsererror.xml', 'http://www.w3.org/1999/xhtml']
        .some(namespace => doc.getElementsByTagNameNS(namespace, 'parsererror').length > 0);
    if (parserErrors) {
        throw new Error('El XML no está bien formado. Revisa las etiquetas y los namespaces.');
    }
    return doc;
}

function generate(mode: Mode, input: string, stack: ToolStack) {
    const value = input.trim();
    if (!value) throw new Error('Escribe un valor para continuar.');

    switch (mode) {
        case 'soql':
            return '/services/data/vXX.X/query?' + new URLSearchParams({ q: value });
        case 'sql': {
            const [table, columnList, ...extraLines] = value.split(/\r?\n/).map(line => line.trim());
            const columns = columnList?.split(',').map(column => column.trim()) ?? [];
            const identifier = /^[A-Za-z_][A-Za-z0-9_]*$/;
            if (extraLines.length || !identifier.test(table) || !columns.length || !columns.every(column => identifier.test(column))) {
                throw new Error('Escribe una tabla y al menos una columna. Usa letras, números o guiones bajos en los identificadores.');
            }
            return 'SELECT ' + columns.join(', ') + '\nFROM ' + table + ';';
        }
        case 'xml':
            return new XMLSerializer().serializeToString(parseXml(value));
        case 'soap': {
            const operation = new XMLSerializer().serializeToString(parseXml(value).documentElement);
            return '<?xml version="1.0" encoding="UTF-8"?>\n'
                + '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\n'
                + '  <soapenv:Body>\n' + operation + '\n  </soapenv:Body>\n</soapenv:Envelope>';
        }
        case 'rest': {
            const url = new URL(value);
            if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
                throw new Error('Usa una URL HTTPS sin credenciales ni fragmento.');
            }
            const code = clientCode(stack, 'GET', url.pathname + url.search, '', false, url.origin);
            return stack === 'apex' ? '// Configura DevForgeDemo con el origen ' + url.origin + '\n' + code : code;
        }
        case 'class':
            if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) {
                throw new Error('Usa un nombre de clase que comience con mayúscula y contenga letras o números.');
            }
            const example = codeExamples.find(item => item.id === toolStacks[stack].classExample);
            if (!example || !('symbol' in example) || !example.symbol) throw new Error('No hay una clase base para esta tecnología.');
            return example.code.replaceAll(example.symbol, value);
    }
}

export default function IntegrationTools({ stack }: { stack: ToolStack }) {
    const initialMode = stack === 'apex' ? 'soql' : 'rest';
    const [mode, setMode] = useState<Mode>(initialMode);
    const [input, setInput] = useState(examples[initialMode]);
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const tool = tools.find(item => item.id === mode)!;
    const sample = examples[mode];
    const sampleOutput = mode === 'xml' ? sample
        : mode === 'soap' ? '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\n  <soapenv:Body>\n    ' + sample + '\n  </soapenv:Body>\n</soapenv:Envelope>'
        : generate(mode, sample, stack);

    return (
        <section id="integraciones" className="panel mt-8 scroll-mt-24 p-6" aria-labelledby="integrations-heading">
            <h2 id="integrations-heading" className="text-xl font-bold">Integraciones, consultas y código</h2>
            <p className="subtle mt-2">Las utilidades procesan el texto en tu navegador. Usa datos ficticios para los ejemplos.</p>
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Utilidades">
                {tools.filter(item => stack === 'apex' || item.id !== 'soql').map(item => (
                    <button key={item.id} type="button" aria-pressed={mode === item.id}
                        className={mode === item.id ? 'btn-primary' : 'btn-secondary'} onClick={() => {
                            setMode(item.id);
                            setInput(examples[item.id]);
                            setOutput('');
                            setStatus('');
                        }}>
                        {item.title}
                    </button>
                ))}
            </div>
            <ToolHelp key={mode} title={'Ayuda y ejemplo · ' + tool.title}>
                <p className="subtle">{tool.help}</p>
                <p className="font-semibold">Entrada de ejemplo</p>
                <HelpText>{sample}</HelpText>
                <p className="font-semibold">Resultado esperado</p>
                <HelpText>{sampleOutput}</HelpText>
                <button type="button" className="btn-secondary text-sm" onClick={() => {
                    setInput(sample);
                    setOutput('');
                    setStatus('');
                }}>Cargar ejemplo</button>
            </ToolHelp>
            <form className="mt-5" onSubmit={event => {
                event.preventDefault();
                try {
                    setOutput(generate(mode, input, stack));
                    setStatus(mode === 'xml' ? 'XML bien formado.' : '');
                } catch (error) {
                    setOutput('');
                    setStatus(error instanceof Error ? error.message : 'No se pudo generar el resultado.');
                }
            }}>
                <label htmlFor="integration-input" className="font-semibold">{tool.inputLabel}</label>
                <p id="integration-help" className="subtle mb-2 mt-1 text-sm">{tool.help}</p>
                <textarea id="integration-input" aria-describedby="integration-help" className="field min-h-28 font-mono"
                    value={input} onChange={event => {
                        setInput(event.target.value);
                        setOutput('');
                        setStatus('');
                    }} />
                <button type="submit" className="btn-primary mt-4">{mode === 'xml' ? 'Validar XML' : 'Generar'}</button>
            </form>
            {output && (
                <div className="mt-5">
                    <label htmlFor="integration-output" className="font-semibold">Resultado</label>
                    <textarea id="integration-output" className="field mt-2 min-h-32 font-mono" value={output} readOnly />
                    <button type="button" className="btn-secondary mt-3" onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(output);
                            setStatus('Resultado copiado.');
                        } catch {
                            setStatus('Selecciona y copia el resultado manualmente.');
                        }
                    }}>Copiar resultado</button>
                </div>
            )}
            <p role="status" className="subtle mt-3 text-sm">{status}</p>
        </section>
    );
}
