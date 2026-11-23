"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiCases, confirmed, emptyCase, qaColumns, salesforceRelease, studioTemplates, type QaCase, type StudioDocument, type TemplateId } from '@/lib/documentStudio';
import { downloadBlob, downloadText } from '@/lib/localDownload';
import { studioExcel, studioMarkdown, studioWord } from '@/lib/studioExport';

type Setup = { template: TemplateId; method?: string; salesforce: boolean };
const maxCases = 30;
const filenames = { word: 'documento-devforge.docx', excel: 'matriz-qa-devforge.xlsx', markdown: 'documento-devforge.md' };

export default function DocumentStudio({ setup }: { setup: Setup }) {
    const [template, setTemplate] = useState<TemplateId>(setup.template);
    const [project, setProject] = useState('');
    const [version, setVersion] = useState('');
    const [owner, setOwner] = useState('');
    const [fields, setFields] = useState<Record<string, string>>(setup.salesforce ? salesforceRelease : {});
    const [cases, setCases] = useState<QaCase[]>(setup.method ? apiCases(setup.method) : [{ ...emptyCase }]);
    const [method, setMethod] = useState(setup.method ?? 'GET');
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const [step, setStep] = useState<'datos' | 'contenido' | 'revision'>('datos');
    const [diagram, setDiagram] = useState('');
    const definition = studioTemplates[template];
    const data: StudioDocument = { template, project, version, owner, fields, cases };

    useEffect(() => {
        try {
            localStorage.setItem('devforge-document-autosave', JSON.stringify({
                template, project, version, owner, fields, cases, method, diagram,
            }));
        } catch {
            // Autoguardado no debe impedir el uso de la vista previa.
        }
    }, [template, project, version, owner, fields, cases, method, diagram]);

    function restoreDraft() {
        try {
            const stored = localStorage.getItem('devforge-document-autosave');
            if (!stored) {
                setStatus('No hay un borrador guardado en este navegador.');
                return;
            }
            const draft = JSON.parse(stored) as {
                template?: TemplateId;
                project?: string;
                version?: string;
                owner?: string;
                fields?: Record<string, string>;
                cases?: QaCase[];
                method?: string;
                diagram?: string;
            };
            if (draft.template) setTemplate(draft.template);
            if (typeof draft.project === 'string') setProject(draft.project);
            if (typeof draft.version === 'string') setVersion(draft.version);
            if (typeof draft.owner === 'string') setOwner(draft.owner);
            if (draft.fields) setFields(draft.fields);
            if (draft.cases) setCases(draft.cases);
            if (draft.method) setMethod(draft.method);
            if (typeof draft.diagram === 'string') setDiagram(draft.diagram);
            setStatus('Borrador local restaurado.');
        } catch {
            setStatus('No se pudo restaurar el borrador local.');
        }
    }

    async function exportFile(kind: keyof typeof filenames) {
        if (busy) return;
        setBusy(true);
        setStatus('');
        try {
            if (kind === 'markdown') downloadText(filenames[kind], studioMarkdown(data), 'text/markdown;charset=utf-8');
            else downloadBlob(filenames[kind], kind === 'word' ? await studioWord(data) : await studioExcel(data));
            setStatus('Descarga preparada.');
        } catch {
            setStatus('No se pudo generar el archivo. Intenta otra vez o descarga el Markdown.');
        } finally {
            setBusy(false);
        }
    }

    function loadExample() {
        setProject('Consulta de pedidos · ejemplo ficticio');
        setVersion('0.1 · borrador');
        setOwner('Equipo de ejemplo');
        if (template === 'qa') setCases(apiCases(method));
        else setFields(current => ({ ...current, ...Object.fromEntries(definition.fields.map(({ title, example }) => [title, example])) }));
        setStatus('Ejemplo ficticio cargado.');
    }

    return <div className="studio-document mt-8">
        <nav className="studio-step-nav jump-nav" aria-label="Pasos del documento">
            {(['datos', 'contenido', 'revision'] as const).map((item, index) => (
                <button key={item} type="button" className="btn-secondary" aria-pressed={step === item} onClick={() => setStep(item)}>
                    {index + 1}. {item === 'datos' ? 'Datos' : item === 'contenido' ? 'Contenido' : 'Revisión'}
                </button>
            ))}
            <button type="button" className="btn-secondary" onClick={restoreDraft}>Restaurar borrador</button>
        </nav>
        <p role="status" className="subtle mt-3">Autoguardado local activo en este navegador.</p>
        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {step !== 'revision' && <section className="studio-controls panel p-5">
            <h2 className="text-xl font-bold">Datos del documento</h2>
            <label className="mt-4 block font-semibold">Tipo de documento<select className="field mt-2" value={template} onChange={event => {
                setTemplate(event.target.value as TemplateId);
                setStatus('');
            }}>{Object.entries(studioTemplates).map(([key, item]) => <option key={key} value={key}>{item.title}</option>)}</select></label>
            <p className="subtle mt-2">{definition.description}</p>
            <details className="mt-3">
                <summary className="cursor-pointer font-semibold">Preparar datos de ejemplo</summary>
                <p className="subtle mt-2">Cargar un ejemplo reemplaza los datos del documento activo.</p>
                <button className="btn-secondary mt-3" type="button" onClick={loadExample}>Cargar ejemplo ficticio</button>
                {template === 'liberacion' && <button className="btn-secondary ml-2 mt-3" type="button" onClick={() => {
                    setFields(current => ({ ...current, ...salesforceRelease }));
                    setStatus('Verificaciones de Salesforce añadidas al plan.');
                }}>Cargar checklist Salesforce</button>}
            </details>
            {template === 'memoria' && <button type="button" className="btn-secondary mt-3" onClick={() => {
                try {
                    const stored = sessionStorage.getItem('devforge-document-dossier');
                    if (!stored) { setStatus('Abre Document Studio desde un expediente en esta pestaña para importar sus datos.'); return; }
                    const dossier = JSON.parse(stored);
                    const value = (key: string) => typeof dossier.values?.[key] === 'string' ? dossier.values[key].slice(0, 3000) : '';
                    setProject(typeof dossier.title === 'string' ? dossier.title.slice(0, 120) : '');
                    setFields(current => ({
                        ...current,
                        'Objetivo y alcance': [value('objective'), value('requirements')].filter(Boolean).join('\n\n').slice(0, 3000),
                        'Arquitectura y componentes': value('decisions'),
                        'Pruebas y evidencia': value('tests'),
                    }));
                    setStatus('Datos del expediente importados. Revisa su ubicación antes de exportar.');
                } catch { setStatus('No se pudo recuperar el expediente.'); }
            }}>Importar datos del expediente</button>}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block font-semibold sm:col-span-2">Proyecto<input className="field mt-2" value={project} maxLength={120} onChange={event => setProject(event.target.value)} /></label>
                <label className="block font-semibold">Versión<input className="field mt-2" value={version} maxLength={60} onChange={event => setVersion(event.target.value)} /></label>
                <label className="block font-semibold">Responsable<input className="field mt-2" value={owner} maxLength={100} onChange={event => setOwner(event.target.value)} /></label>
            </div>
            {template !== 'qa' ? <div className="mt-4 space-y-3">
                {definition.fields.map(field => <label key={field.title} className="block font-semibold">{field.title}
                    <textarea className="field mt-2 min-h-24 font-normal" placeholder={field.tip} value={fields[field.title] ?? ''} maxLength={3000}
                        onChange={event => {
                            const value = event.target.value;
                            setFields(current => ({ ...current, [field.title]: value }));
                        }} />
                </label>)}
            </div> : <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-[color:var(--line)] p-4">
                    <label className="font-semibold">Método de la API<select className="field mt-2" value={method} onChange={event => setMethod(event.target.value)}>
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(verb => <option key={verb}>{verb}</option>)}
                    </select></label>
                    <button className="btn-secondary mt-3" type="button" disabled={cases.length + 7 > maxCases} onClick={() => {
                        const examples = apiCases(method);
                        setCases(current => current.length === 1 && !current[0].scenario && qaColumns.slice(1, -1).every(([key]) => !current[0][key])
                            ? examples : [...current, ...examples]);
                        setStatus('Casos de API añadidos. Adapta los resultados al contrato.');
                    }}>Añadir casos de API</button>
                </div>
                {cases.map((row, index) => <details className="rounded-xl border border-[color:var(--line)] p-4" key={index} open={index === 0 ? true : undefined}>
                    <summary className="cursor-pointer font-semibold">Caso {index + 1} · {row.scenario || 'Sin título'}</summary>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {qaColumns.map(([key, label]) => <label className="block text-sm font-semibold" key={key}>{label}<textarea
                            className="field mt-2 min-h-16 font-normal" value={row[key]} maxLength={1000} onChange={event => {
                                const value = event.target.value;
                                setCases(current => current.map((item, position) => position === index ? { ...item, [key]: value } : item));
                            }} /></label>)}
                    </div>
                    <button type="button" className="btn-secondary mt-3" disabled={cases.length === 1}
                        onClick={() => setCases(current => current.filter((_, position) => position !== index))}>Quitar caso {index + 1}</button>
                </details>)}
                <button className="btn-secondary" type="button" disabled={cases.length >= maxCases}
                    onClick={() => setCases(current => [...current, { ...emptyCase }])}>Añadir caso en blanco</button>
            </div>}
            {step !== 'datos' && <label className="mt-5 block font-semibold">Diagrama Mermaid
                <textarea className="field mt-2 min-h-24 font-mono text-sm" value={diagram}
                    onChange={event => setDiagram(event.target.value)}
                    placeholder={'flowchart LR\n  Usuario --> API\n  API --> Datos'} />
            </label>}
        </section>}
        {step !== 'datos' && <div className="min-w-0">
            <div className="studio-controls mb-4 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" disabled={busy} onClick={() => void exportFile(template === 'qa' ? 'excel' : 'word')}>
                    {template === 'qa' ? 'Descargar Excel' : 'Descargar Word'}</button>
                <button type="button" className="btn-secondary" onClick={() => window.print()}>Imprimir o guardar PDF</button>
                <button type="button" className="btn-secondary" disabled={busy} onClick={() => void exportFile('markdown')}>Descargar Markdown</button>
                {template === 'qa' && <button type="button" className="btn-secondary" disabled={busy} onClick={() => void exportFile('word')}>Descargar Word</button>}
            </div>
            <p role="status" className="studio-controls subtle mb-3">{status}</p>
            <article className="studio-preview panel p-6" aria-label="Vista previa del documento">
                <p className="studio-controls text-sm font-semibold text-[color:var(--accent)]">Vista previa</p>
                <header className="border-b border-[color:var(--line)] pb-4">
                    <h2 className="section-title mt-2">{definition.title}</h2>
                    <p className="mt-2 font-semibold">{confirmed(project)}</p>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div><dt className="subtle">Versión</dt><dd>{confirmed(version)}</dd></div>
                        <div><dt className="subtle">Responsable</dt><dd>{confirmed(owner)}</dd></div>
                    </dl>
                </header>
                {diagram && <section className="studio-block border-b border-[color:var(--line)] py-4">
                    <h3 className="text-lg font-bold">Diagrama de arquitectura</h3>
                    <pre className="field mt-2 overflow-auto text-sm"><code>{diagram}</code></pre>
                </section>}
                {template === 'qa' ? <div className="space-y-4 pt-4">
                    {cases.map((row, index) => <section className="studio-block" key={index}>
                        <h3 className="text-lg font-bold">{index + 1}. {confirmed(row.scenario)}</h3>
                        <dl className="mt-2 space-y-2 text-sm">
                            {qaColumns.slice(1).map(([key, label]) => <div key={key}><dt className="font-semibold">{label}</dt>
                                <dd className="whitespace-pre-wrap break-words">{confirmed(row[key])}</dd></div>)}
                        </dl>
                    </section>)}
                </div> : <div className="space-y-4 pt-4">
                    {definition.fields.map(field => <section className="studio-block" key={field.title}>
                        <h3 className="text-lg font-bold">{field.title}</h3>
                        <p className="mt-1 whitespace-pre-wrap break-words">{confirmed(fields[field.title] ?? '')}</p>
                    </section>)}
                </div>}
            </article>
            <p className="studio-controls subtle mt-4 text-sm">El navegador prepara los archivos. Al abrir el Word, actualiza el índice si tu editor lo solicita.</p>
            <Link className="studio-controls text-link mt-3 inline-block" href="/expediente">Volver al expediente</Link>
        </div>}
        </div>
    </div>;
}
