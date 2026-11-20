"use client";

import { useState } from 'react';
import TextResult from './TextResult';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]!));

export default function ProjectAndPortfolio({ mode }: { mode: 'portfolio' | 'project' }) {
    const [output, setOutput] = useState<{ text: string; html?: string }>();
    const portfolio = mode === 'portfolio';
    return (
        <div className="panel mt-8 p-6">
            <form className="space-y-4" onChange={() => setOutput(undefined)} onSubmit={event => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const title = String(data.get('title')).trim();
                const detail = String(data.get('detail')).trim();
                const stack = String(data.get('stack')).trim();
                const entries = String(data.get('entries')).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
                if (portfolio) {
                    const text = '# ' + title + '\n\n' + detail + '\n\n## Tecnologías\n\n' + stack + '\n\n## Experiencia y proyectos\n\n' + entries.map(item => '- ' + item).join('\n');
                    const github = String(data.get('github')).trim();
                    let profile = '';
                    if (github) {
                        const url = new URL(github);
                        if (url.origin === 'https://github.com' && !url.username && !url.password) profile = url.href;
                    }
                    const html = '<!doctype html>\n<html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
                        '<title>' + escapeHtml(title) + '</title><style>body{max-width:48rem;margin:3rem auto;padding:0 1rem;font:1.1rem/1.6 system-ui;color:#172033}header{border-bottom:2px solid #1f6077}a{color:#14516a}p,li{overflow-wrap:anywhere}</style>' +
                        '<body><main><header><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(detail) + '</p></header><h2>Tecnologías</h2><p>' + escapeHtml(stack) + '</p><h2>Experiencia y proyectos</h2><ul>' +
                        entries.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>' +
                        (profile ? '<p><a href="' + escapeHtml(profile) + '">GitHub</a></p>' : '') + '</main></body></html>';
                    setOutput({ text: text + (profile ? '\n\n[GitHub](' + profile + ')' : ''), html });
                } else {
                    const requirements = entries.length ? entries.map(item => '- [ ] ' + item).join('\n') : '- [ ] Añade la primera función y su criterio de aceptación.';
                    setOutput({ text: '# ' + title + '\n\n## Problema y público\n\n' + detail + '\n\n## Requisitos\n\n' + requirements +
                        '\n\n## Historias de usuario\n\n- Como [persona], quiero [acción] para [resultado].\n- Se acepta cuando [resultado verificable].\n\n## Estructura técnica\n\n' + stack +
                        '\n\n- Interfaz y datos de entrada\n- Servicio o lógica de negocio\n- Persistencia e integraciones\n\n## Entregas\n\n1. Validar el problema con un ejemplo.\n2. Implementar un flujo de principio a fin.\n3. Revisar errores, accesibilidad y privacidad.\n4. Documentar pruebas y entrega.\n' });
                }
            }}>
                <label className="block">{portfolio ? 'Nombre profesional' : 'Nombre del proyecto'}<input className="field mt-2" name="title" required maxLength={100} /></label>
                <label className="block">{portfolio ? 'Resumen profesional' : 'Problema que quieres resolver y para quién'}<textarea className="field mt-2" name="detail" required maxLength={1200} /></label>
                <label className="block">Tecnologías<input className="field mt-2" name="stack" maxLength={240} placeholder="Apex, Kotlin, React…" /></label>
                <label className="block">{portfolio ? 'Experiencia y proyectos (una línea por entrada)' : 'Funciones previstas (una por línea)'}<textarea className="field mt-2 min-h-32" name="entries" maxLength={3000} /></label>
                {portfolio && <label className="block">Enlace público de GitHub (opcional)<input className="field mt-2" name="github" type="url" pattern="https://github\.com/.+" placeholder="https://github.com/usuario" /></label>}
                <button className="btn-primary" type="submit">{portfolio ? 'Generar portafolio y CV' : 'Generar plan'}</button>
            </form>
            {output && <>
                <h2 className="mt-6 text-xl font-bold">{portfolio ? 'CV en Markdown' : 'Plan en Markdown'}</h2>
                <TextResult value={output.text} filename={portfolio ? 'cv.md' : 'proyecto.md'} />
                {output.html && <><h2 className="mt-6 text-xl font-bold">Página HTML para compartir</h2>
                    <TextResult value={output.html} filename="portafolio.html" type="text/html;charset=utf-8" />
                    <iframe title="Vista previa del portafolio" sandbox="" className="mt-4 h-96 w-full rounded-xl bg-white" srcDoc={output.html} />
                </>}
            </>}
        </div>
    );
}
