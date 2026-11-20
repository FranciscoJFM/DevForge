"use client";

import Link from 'next/link';
import { useState } from 'react';
import { downloadText } from '@/lib/localDownload';

const sections = [
    ['objective', 'Objetivo', 'Qué problema resolviste y para quién.'],
    ['requirements', 'Requisitos', 'Alcance, restricciones y criterios de aceptación.'],
    ['decisions', 'Decisiones técnicas', 'Qué elegiste y qué opciones consideraste.'],
    ['tests', 'Pruebas y resultados', 'Comandos, casos y resultados que otra persona puede verificar.'],
    ['lessons', 'Aprendizajes', 'Qué cambiarías y qué explicarías en una entrevista.'],
] as const;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]!));

function readImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error());
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

type Initial = { title: string; objective: string; requirements: string; ticketId?: string };

export default function ProjectDossier({ initial }: { initial: Initial }) {
    const [title, setTitle] = useState(initial.title);
    const [values, setValues] = useState<Record<string, string>>({ objective: initial.objective, requirements: initial.requirements });
    const [images, setImages] = useState<File[]>([]);
    const [status, setStatus] = useState('');
    const [exporting, setExporting] = useState(false);

    async function exportDossier(kind: 'md' | 'html') {
        const name = title.trim() || 'Expediente del proyecto';
        const entries = sections.map(([id, label]) => [label, values[id]?.trim() || 'Por completar.']);
        if (kind === 'md') {
            const body = entries.map(([label, value]) => '## ' + label + '\n\n' + value).join('\n\n');
            const note = images.length ? '\n\n## Capturas adjuntas en la versión HTML\n\n' + images.map(file => '- ' + file.name.replace(/[\r\n]/g, ' ')).join('\n') : '';
            downloadText('expediente.md', '# ' + name + '\n\n' + body + note + '\n', 'text/markdown;charset=utf-8');
            setStatus('Markdown generado.');
            return;
        }
        setExporting(true);
        try {
            const figures = await Promise.all(images.map(async file =>
                '<figure><img alt="' + escapeHtml('Captura: ' + file.name) + '" src="' + escapeHtml(await readImage(file)) + '"><figcaption>' + escapeHtml(file.name) + '</figcaption></figure>'
            ));
            const body = entries.map(([label, value]) => '<section><h2>' + escapeHtml(label) + '</h2><p>' + escapeHtml(value) + '</p></section>').join('');
            const html = '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
                + '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'">'
                + '<title>' + escapeHtml(name) + '</title><style>body{font:1rem/1.6 system-ui;max-width:45rem;margin:2rem auto;padding:0 1rem;color:#15251f}h1,h2{line-height:1.2}p{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%;height:auto}figure{margin:1rem 0}figcaption{overflow-wrap:anywhere}</style>'
                + '<main><h1>' + escapeHtml(name) + '</h1>' + body
                + (figures.length ? '<section><h2>Capturas</h2>' + figures.join('') + '</section>' : '') + '</main></html>';
            downloadText('expediente.html', html, 'text/html;charset=utf-8');
            setStatus('HTML generado con las capturas seleccionadas.');
        } catch {
            setStatus('No se pudo leer alguna captura. Intenta elegirla de nuevo o descarga el Markdown.');
        } finally {
            setExporting(false);
        }
    }

    return <section className="panel mt-8 p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-3">
            <label className="btn-secondary cursor-pointer focus-within:outline-2 focus-within:outline-offset-4">
                Importar plan Markdown
                <input className="sr-only" type="file" accept=".md,.txt,text/markdown,text/plain" onChange={async event => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    if (file.size > 16000) { setStatus('El plan debe pesar menos de 16 KB.'); return; }
                    try {
                        const text = await file.text();
                        setValues(current => ({ ...current, requirements: text }));
                        setStatus('Plan cargado en Requisitos.');
                    } catch { setStatus('No se pudo leer el plan.'); }
                }} />
            </label>
            {initial.ticketId && <button type="button" className="btn-secondary" onClick={() => {
                try {
                    const notes = sessionStorage.getItem('devforge-ticket:' + initial.ticketId);
                    if (!notes) { setStatus('Todavía no hay diagnóstico para este ticket en esta pestaña.'); return; }
                    setValues(current => ({ ...current, decisions: notes }));
                    setStatus('Diagnóstico cargado en Decisiones técnicas.');
                } catch { setStatus('No se pudo recuperar el diagnóstico.'); }
            }}>Importar mi diagnóstico</button>}
            <Link href="/project-builder" className="text-link">Crear un plan en Project Builder</Link>
        </div>
        <label className="mt-5 block font-semibold">Nombre del proyecto
            <input className="field mt-2" maxLength={120} value={title} onChange={event => setTitle(event.target.value)} />
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            {sections.map(([id, label, hint]) => <label key={id} className="block font-semibold">{label}
                <textarea className="field mt-2 min-h-28 font-normal" value={values[id] ?? ''} placeholder={hint} maxLength={16000} onChange={event => {
                    const value = event.target.value;
                    setValues(current => ({ ...current, [id]: value }));
                }} />
            </label>)}
            <div>
                <label className="block font-semibold">Capturas opcionales
                    <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="field mt-2" onChange={event => {
                        const picked = Array.from(event.target.files ?? []);
                        if (picked.length > 3 || picked.some(file => file.size > 2 * 1024 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type))) {
                            event.target.value = '';
                            setImages([]);
                            setStatus('Elige hasta tres capturas PNG, JPEG o WebP de 2 MB como máximo cada una.');
                            return;
                        }
                        setImages(picked);
                        setStatus('');
                    }} />
                </label>
                <p className="subtle mt-2">El HTML incluye las capturas. El Markdown lista sus nombres.</p>
            </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={exporting} className="btn-primary" onClick={() => void exportDossier('md')}>Descargar Markdown</button>
            <button type="button" disabled={exporting} className="btn-secondary" onClick={() => void exportDossier('html')}>{exporting ? 'Preparando HTML…' : 'Descargar HTML'}</button>
            <Link className="btn-secondary" href="/portafolio">Preparar mi portafolio</Link>
        </div>
        {status && <p role="status" className="subtle mt-3">{status}</p>}
    </section>;
}
