"use client";

import { useState } from 'react';
import Link from 'next/link';
import ToolHelp, { HelpText } from './ToolHelp';
import { clientCode } from '@/lib/integrationClient';
import { initialRecords, soapExample, soapNamespace } from '@/lib/integrationLab';
import { downloadText } from '@/lib/localDownload';
import { unitTestExamples } from '@/lib/unitTestExamples';
import { memoryFields, sampleMemory } from '@/lib/technicalMemory';
import { toolStacks, type ToolStack } from '@/lib/toolStacks';

const templates = [
    { title: 'README', sections: ['Qué problema resuelve', 'Requisitos', 'Instalación y ejecución', 'Pruebas', 'Responsable'] },
    { title: 'Integración REST', protocol: 'rest', sections: ['Objetivo', 'Método y ruta', 'Autenticación y permisos', 'Código cliente', 'Respuesta de ejemplo', 'Errores y reintentos', 'Pruebas', 'Responsable'] },
    { title: 'Integración SOAP', protocol: 'soap', sections: ['Objetivo', 'Endpoint y WSDL', 'Operación y namespaces', 'Autenticación y permisos', 'Ejemplo de sobre', 'Código cliente', 'Respuesta de ejemplo', 'SOAP Faults y reintentos', 'Pruebas', 'Responsable'] },
    { title: 'Registro de decisión', sections: ['Contexto', 'Opciones', 'Decisión', 'Consecuencias', 'Responsable'] },
    { title: 'Guía de entrega', sections: ['Alcance', 'Dependencias', 'Pasos de entrega', 'Verificación', 'Reversión', 'Responsable'] },
    { title: 'Documentación funcional', sections: ['Objetivo y alcance', 'Actores', 'Flujo principal', 'Reglas de negocio', 'Criterios de aceptación', 'Fuera de alcance'] },
    { title: 'Memoria técnica', sections: memoryFields.map(field => field.title) },
    { title: 'Documentación técnica', sections: ['Arquitectura', 'Componentes y dependencias', 'Modelo de datos y contratos', 'Configuración por ambiente', 'Observabilidad', 'Pruebas'] },
    { title: 'Manual de usuario', sections: ['A quién va dirigido', 'Antes de empezar', 'Pasos de uso', 'Solución de problemas', 'Canal de soporte'] },
    { title: 'Caso de uso', sections: ['Actor y objetivo', 'Precondiciones', 'Flujo principal', 'Flujos alternativos', 'Resultado esperado'] },
    { title: 'Plan de pruebas unitarias', sections: ['Alcance', 'Preparar, ejecutar y verificar', 'Código de prueba', 'Casos límite', 'Pruebas'] },
    { title: 'Checklist de liberación', sections: ['Versión y ambiente', 'Antes del despliegue', 'Verificación posterior', 'Criterios para revertir', 'Responsable y comunicación'] },
    { title: 'Diagrama de flujo', sections: ['Alcance', 'Diagrama Mermaid', 'Decisiones pendientes'] },
    { title: 'Diagrama de secuencia', sections: ['Alcance', 'Diagrama Mermaid', 'Decisiones pendientes'] },
];

const codeLanguages: Record<ToolStack, string> = {
    apex: 'apex', kotlin: 'kotlin', fetch: 'javascript', java: 'java', swift: 'swift', python: 'python', ruby: 'ruby',
};

const documentExamples: Record<string, string> = {
    README: '# Directorio de cuentas\n\n## Qué problema resuelve\nPermite encontrar cuentas por nombre.\n\n## Pruebas\nVerificar búsqueda, lista vacía y error de red.',
    'Registro de decisión': '# Elegir el cliente HTTP\n\n## Contexto\nLa aplicación consulta un catálogo externo.\n\n## Decisión\nReutilizar un cliente y configurar un tiempo máximo por petición.\n\n## Consecuencias\nLas pruebas pueden simular demoras y errores.',
    'Guía de entrega': '# Entrega del directorio\n\n## Verificación\nConfirma que la búsqueda funciona con datos ficticios.\n\n## Reversión\nIdentifica la versión anterior y documenta cómo restaurarla.',
};

const workflow = 'flowchart TD\n    A[Usuario abre el formulario] --> B{Datos válidos}\n    B -->|Sí| C[Guardar y confirmar]\n    B -->|No| D[Mostrar errores]\n    D --> A';
const sequence = 'sequenceDiagram\n    actor Usuario\n    participant Web as Aplicación\n    participant API as Servicio\n    Usuario->>Web: Buscar cuenta\n    Web->>API: GET /cuentas\n    API-->>Web: 200 y resultados\n    Web-->>Usuario: Mostrar lista';

const appliedSections: Record<string, string> = {
    'Antes del despliegue': '- [ ] Identificar versión y ambiente.\n- [ ] Confirmar pruebas, dependencias y aprobación.\n- [ ] Verificar respaldo y plan de reversión.',
    'Verificación posterior': '- [ ] Probar el flujo principal.\n- [ ] Revisar errores y métricas.\n- [ ] Comunicar el estado y quién monitorea.',
    'Criterios para revertir': 'Define el indicador, el umbral, quién decide y qué versión se restaura.',
    'Preparar, ejecutar y verificar': 'Crea los datos mínimos, invoca el método y compara el resultado con el valor esperado. Empieza por CuentaServicio en la biblioteca de ejemplos.',
    'Casos límite': '- Etiqueta vacía.\n- Caracteres especiales.\n- Confirma el comportamiento esperado antes de escribir la prueba.',
    'Flujo principal': '1. La persona abre el formulario.\n2. Escribe el nombre de la cuenta.\n3. El sistema guarda los cambios y confirma el resultado.',
    'Flujos alternativos': 'Si el nombre está vacío, el sistema señala el campo y conserva lo que ya se escribió.',
    'Criterios de aceptación': 'Dado un nombre válido, al guardar la cuenta, se muestra una confirmación y el registro aparece en el directorio.',
    'Pasos de uso': '1. Abre el directorio.\n2. Selecciona Nueva cuenta.\n3. Completa Nombre y elige Guardar.',
};

const fence = (language: string, text: string) => '```' + language + '\n' + text + '\n```';

export default function DocumentationGenerator({ stack }: { stack: ToolStack }) {
    const [selected, setSelected] = useState(0);
    const [title, setTitle] = useState('');
    const [markdown, setMarkdown] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [memoryDraft, setMemoryDraft] = useState<Record<string, string>>({});
    const template = templates[selected];
    const isMemory = template.title === 'Memoria técnica';
    const technology = toolStacks[stack];
    const soap = template.protocol === 'soap';
    const method = soap ? 'POST' : 'GET';
    const path = soap ? '/calculator' : '/posts/1';
    const unit = template.title === 'Plan de pruebas unitarias' ? unitTestExamples[stack] : undefined;
    const diagram = template.title === 'Diagrama de flujo' ? workflow : template.title === 'Diagrama de secuencia' ? sequence : '';
    const code = template.protocol ? clientCode(stack, method, path, soap ? soapExample : '', soap) : '';

    return (
        <section id="documentacion" aria-labelledby="documentation-heading" className="panel mt-8 scroll-mt-24 p-6">
            <h2 id="documentation-heading" className="text-xl font-bold">Generador de documentación Markdown</h2>
            <p className="subtle mt-2">Genera un borrador y completa las secciones con datos de tu proyecto. Usa ejemplos sin credenciales.</p>
            <Link className="btn-secondary mt-4" href="/documentos">Abrir Document Studio para Word, PDF o Excel</Link>
            <form className="mt-5 space-y-4" onSubmit={event => {
                event.preventDefault();
                const heading = title.trim() || template.title;
                if (isMemory) {
                    const filled = memoryFields.map(field => '## ' + field.title + '\n\n' + (memoryDraft[field.title]?.trim() || 'Pendiente de confirmar.')).join('\n\n');
                    setMarkdown('# ' + heading + '\n\nTecnología: ' + technology.label + '\n\n' + filled + '\n');
                    setStatus('Memoria técnica generada.');
                    return;
                }
                const hints: Record<string, string> = {
                    Requisitos: technology.requirement,
                    Pruebas: technology.verification,
                    Verificación: technology.verification,
                    'Autenticación y permisos': technology.requirement,
                };
                const contents: Record<string, string> = {
                    ...appliedSections,
                    'Código de prueba': unit ? fence(unit.language, unit.code) : '',
                    'Diagrama Mermaid': diagram ? fence('mermaid', diagram) : '',
                    'Método y ruta': '`GET https://example.invalid/posts/1` con `Accept: application/json`.',
                    'Endpoint y WSDL': '`POST https://example.invalid/calculator`. Al adaptarlo, registra la ubicación del WSDL de tu servicio.',
                    'Operación y namespaces': '`Add` en `urn:devforge:calculator` con `SOAPAction: "urn:devforge:Add"`.',
                    'Ejemplo de sobre': fence('xml', soapExample),
                    'Código cliente': (stack === 'apex' ? 'Configura la Named Credential `DevForgeDemo` para tu servicio de pruebas.\n\n' : '')
                        + fence(codeLanguages[stack], code),
                    'Respuesta de ejemplo': soap
                        ? fence('xml', '<soap:Envelope xmlns:soap="' + soapNamespace + '">\n  <soap:Body>\n    <AddResponse xmlns="urn:devforge:calculator"><AddResult>40</AddResult></AddResponse>\n  </soap:Body>\n</soap:Envelope>')
                        : fence('json', JSON.stringify(initialRecords[0], null, 2)),
                    'Errores y reintentos': 'Documenta qué hará el cliente ante un 404, un 429 con Retry-After y un 503.',
                    'SOAP Faults y reintentos': 'Revisa si el Body contiene SOAP Fault. Documenta qué errores son transitorios y cuándo se puede repetir la operación.',
                };
                setMarkdown('# ' + heading + '\n\nTecnología: ' + technology.label + '\n\n'
                    + template.sections.map(section => '## ' + section + '\n\n'
                        + (contents[section] ?? '<!-- ' + (hints[section] ?? 'Completa esta sección.') + ' -->')).join('\n\n') + '\n');
                setStatus('Borrador generado.');
            }}>
                <div>
                    <label htmlFor="documentation-type" className="font-semibold">Tipo de documento</label>
                    <select id="documentation-type" className="field mt-2" value={selected} onChange={event => {
                        setSelected(Number(event.target.value));
                        setMarkdown(null);
                        setStatus('');
                    }}>
                        {templates.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="documentation-title" className="font-semibold">Título (opcional)</label>
                    <input id="documentation-title" className="field mt-2" value={title} maxLength={100} onChange={event => setTitle(event.target.value)} />
                </div>
                {isMemory && <div className="space-y-4">
                    <p className="subtle">Describe cómo funciona la solución y cómo se comprueba. Las secciones sin completar quedan pendientes de confirmar.</p>
                    <button type="button" className="btn-secondary" onClick={() => {
                        setTitle('Consulta de pedidos · ejemplo ficticio');
                        setMemoryDraft(Object.fromEntries(memoryFields.map(field => [field.title, field.example])));
                        setStatus('Ejemplo ficticio cargado.');
                    }}>Cargar memoria de ejemplo</button>
                    <div className="grid gap-4 md:grid-cols-2">
                        {memoryFields.map(({ title: fieldTitle }, index) => <label key={fieldTitle} className="block font-semibold">{fieldTitle}
                            <textarea className="field mt-2 min-h-28 font-normal" required={index < 2} maxLength={3000}
                                value={memoryDraft[fieldTitle] ?? ''} onChange={event => {
                                    const value = event.target.value;
                                    setMemoryDraft(current => ({ ...current, [fieldTitle]: value }));
                                }} />
                        </label>)}
                    </div>
                </div>}
                <button type="submit" className="btn-primary">Generar borrador</button>
            </form>
            <ToolHelp key={template.title} title={'Ayuda y ejemplo · ' + template.title}>
                {isMemory ? <HelpText>{sampleMemory}</HelpText> : code ? <>
                    <p className="subtle">Cambia la tecnología de trabajo para ver el cliente en otro lenguaje. El borrador incluye el código y la respuesta esperada. Sustituye el servicio ficticio por el tuyo al adaptar el ejemplo.</p>
                    <HelpText>{soap ? soapExample : 'GET /posts/1\nAccept: application/json'}</HelpText>
                </> : <>
                    <p className="subtle">Genera el borrador y reemplaza los comentarios con datos de tu proyecto. Las secciones se pueden editar antes de copiar o descargar.</p>
                    <HelpText>{unit?.code || diagram || documentExamples[template.title] || (template.sections.find(section => appliedSections[section])
                        ? appliedSections[template.sections.find(section => appliedSections[section])!] : 'Describe el propósito y quién mantiene este documento.')}</HelpText>
                </>}
            </ToolHelp>
            {unit && <div className="mt-6">
                <h3 className="font-semibold">Prueba de ejemplo · {technology.label}</h3>
                <p className="subtle mt-2 text-sm">Usa la clase CuentaServicio de los ejemplos de tu tecnología y el framework de pruebas de tu proyecto.</p>
                <HelpText>{unit.code}</HelpText>
            </div>}
            {diagram && <div className="mt-6"><h3 className="mb-2 font-semibold">Código del diagrama Mermaid</h3><HelpText>{diagram}</HelpText></div>}
            {code && <div className="mt-6">
                <h3 className="font-semibold">Código de ejemplo · {technology.label}</h3>
                <p className="subtle mt-2 text-sm">{method} {path} · Incluido en el borrador Markdown.</p>
                <pre className="field mt-3 max-h-80 overflow-auto text-sm"><code>{code}</code></pre>
            </div>}
            {markdown !== null && (
                <div className="mt-5">
                    <label htmlFor="documentation-output" className="font-semibold">Borrador editable</label>
                    <textarea id="documentation-output" className="field mt-2 min-h-64 font-mono" value={markdown} onChange={event => setMarkdown(event.target.value)} />
                    <button type="button" className="btn-secondary mt-3" onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(markdown);
                            setStatus('Documento copiado.');
                        } catch {
                            setStatus('Selecciona y copia el documento manualmente.');
                        }
                    }}>Copiar Markdown</button>
                    <button type="button" className="btn-secondary ml-2 mt-3" onClick={() => downloadText('documentacion.md', markdown)}>Descargar Markdown</button>
                </div>
            )}
            <p role="status" className="subtle mt-3 text-sm">{status}</p>
        </section>
    );
}
