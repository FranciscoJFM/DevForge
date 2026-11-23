"use client";

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { posts, products } from '@/lib/data';
import { studyTracks } from '@/lib/studyTracks';

const resources = [
    ['DevForge 3.0', '/devforge-3', '20 herramientas técnicas profesionales Rescue Center diagnóstico pruebas arquitectura'],
    ['Rescue Center', '/rescue-center', 'resolver error despliegue carga laboral tecnología IA'],
    ['Document Studio', '/documentos', 'Word DOCX PDF Excel XLSX plantilla memoria funcional contrato documentación'],
    ['Matriz QA/UAT', '/documentos?plantilla=qa', 'pruebas API Excel evidencia casos defecto'],
    ['Plan de liberación Salesforce', '/documentos?plantilla=liberacion&plataforma=salesforce', 'despliegue Flow verificación reversión'],
    ['QuickFix', '/debug#quickfix', 'SOQL CORS git conflictos diagnóstico'],
    ['Tutorial REST confiable', '/academia/rest-confiable', 'Node.js HTTP pruebas timeout JSON validación API errores casos'],
    ['Memoria técnica', '/herramientas#documentacion', 'plantilla arquitectura contratos seguridad observabilidad Markdown'],
    ['Retos basados en tickets', '/retos', 'diagnóstico error formulario SOQL Android solución pruebas'],
    ['Expediente de proyecto', '/expediente', 'exportar evidencia Markdown HTML capturas requisitos decisiones pruebas portafolio'],
    ['Inglés para desarrolladores', '/ingles', 'English inglés técnico entrevista CV resume correo conversación Salesforce Android React'],
    ['CV y correo en inglés', '/ingles#postulacion', 'resume application hiring correo plantillas'],
    ['Cliente HTTP en vivo', '/cliente-http', 'API REST JSONPlaceholder PokeAPI URL GET POST PUT PATCH DELETE'],
    ['Extensiones para el IDE', '/ide', 'plugins VS Code Salesforce Android ESLint EditorConfig REST Client'],
    ['Playground y retos JavaScript', '/playground', 'escribir ejecutar código editor ejercicios pruebas'],
    ['Revisión de código', '/revision-codigo', 'Clean Code SOLID mantenimiento seguridad sugerencias'],
    ['Git y repositorios', '/git', 'comandos commit pull request diff switch ramas GitHub repositorios'],
    ['CV, postulaciones e ingresos entre empleos', '/guia-empleo', 'correo CV empleo ventas garaje Uber emprendimiento'],
    ['Foro moderado de Empatía Jobs', '/foro', 'relato experiencia laboral sin nombre moderación dudas técnicas'],
    ['Integration Lab REST y SOAP', '/integration-lab', 'OpenAPI Swagger CRUD GET POST PUT PATCH DELETE SOAP Fault catálogo inventario SKU'],
    ['Ejemplos y generadores de código', '/ejemplos', 'Apex Kotlin Java Swift Python Ruby TypeScript constructor método formulario REST SOAP wrapper Flow Queueable WorkManager job'],
    ['API Studio', '/api-studio', 'cURL fetch REST SOAP XML solicitud documentación'],
    ['Portfolio DevForge', '/portafolio', 'portafolio GitHub CV HTML Markdown'],
    ['Project Builder', '/project-builder', 'idea requisitos historias arquitectura roadmap'],
    ['Interview Lab', '/entrevistas', 'entrevista JavaScript React Android Salesforce Apex SQL APIs'],
    ['Revisar una vacante', '/analizar-vacante', 'oferta guardias salario prueba técnica'],
    ['Inventario de dependencias npm', '/seguridad#dependencias', 'package.json revisión seguridad'],
    ['Desarrollo Salesforce', '/desarrollo#salesforce', 'Apex LWC Flow SOQL SOSL REST SOAP despliegue'],
    ['Desarrollo Android', '/desarrollo#android', 'Kotlin Compose Java móvil'],
    ['Desarrollo web', '/desarrollo#web', 'React JavaScript TypeScript API'],
    ['Mapa para cambiar de stack', '/desarrollo#cambiar-de-stack', 'Java Salesforce Android React'],
    ['De documentación a desarrollo', '/trayectoria', 'Experiencia profesional Tableau analítica'],
    ['Academia', '/academia', 'ejercicios prácticas guías iOS Django Ruby'],
    ['Herramientas de integración', '/herramientas#integraciones', 'REST SOAP XML SQL SOQL Apex API'],
    ['Generador de documentación', '/herramientas#documentacion', 'REST SOAP Markdown README entrega liberación pruebas unitarias documentación técnica funcional manual casos de uso Mermaid diagramas'],
    ['Plantillas laborales', '/herramientas#plantillas', 'Empleo CV postulaciones guardias'],
    ['Herramientas de texto', '/herramientas#texto', 'JSON UUID URL comparador'],
    ['Debug Lab: hidratación', '/debug#hidratacion', 'Next.js React error menú'],
    ['Debug Lab: SOQL', '/debug#soql', 'Salesforce REST consulta parámetro'],
    ['Debug Lab: SOAP', '/debug#soap', 'XML WSDL namespace error integración'],
    ['Demo de CotizaFácil', '/apps/cotizafacil#demo', 'cotización PDF presupuesto'],
    ['Empatía Jobs', '/empleo', 'empleo vacantes currículum'],
    ['Trabajo sostenible', '/trabajo-sostenible', 'abuso descanso alcance guardias'],
    ['Seguridad aplicada', '/seguridad', 'validación secretos dependencias sesiones'],
    ['IA responsable', '/ia-responsable', 'IDE privacidad revisión código'],
    ['Videoblog', '/videoblog', 'tutorial videos'],
    ...studyTracks.map(track => ['Ruta de estudio de ' + track.name, '/academia/' + track.slug, 'Ejercicios, proyecto final y ' + track.resource.kind.toLowerCase() + ' · ' + track.stack]),
    ...products.map(item => [item.name, '/apps/' + item.slug, item.tag + ' ' + item.description]),
    ...posts.map(item => [item.title, '/academia#' + item.slug, item.category + ' ' + item.excerpt]),
];

function normalize(text: string) {
    return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export default function ResourceSearch() {
    const dialog = useRef<HTMLDialogElement>(null);
    const [query, setQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recent, setRecent] = useState<string[]>([]);

    function readSaved(key: string) {
        try {
            const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
            return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
        } catch {
            return [];
        }
    }

    function writeSaved(key: string, items: string[]) {
        try {
            localStorage.setItem(key, JSON.stringify(items));
        } catch {
            // Keep the current session usable when storage is unavailable.
        }
    }
    const openSearch = useCallback(() => {
        if (!dialog.current || dialog.current.open) return;
        setQuery('');
        setFavorites(readSaved('devforge-favorites'));
        setRecent(readSaved('devforge-recent'));
        dialog.current.showModal();
    }, []);

    useEffect(() => {
        const fromHome = (event: Event) => {
            const custom = event as CustomEvent<{ query?: string }>;
            if (!dialog.current || dialog.current.open) return;
            setQuery(custom.detail?.query?.trim() ?? '');
            setFavorites(readSaved('devforge-favorites'));
            setRecent(readSaved('devforge-recent'));
            dialog.current.showModal();
        };
        const shortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                openSearch();
            }
        };
        window.addEventListener('keydown', shortcut);
        window.addEventListener('devforge-open-search', fromHome);
        return () => {
            window.removeEventListener('keydown', shortcut);
            window.removeEventListener('devforge-open-search', fromHome);
        };
    }, [openSearch]);

    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    const matches = terms.length
        ? resources.filter(item => terms.every(term => normalize(item.join(' ')).includes(term)))
        : [...new Set([...favorites, ...recent])].flatMap(href => {
            const match = resources.find(item => item[1] === href);
            return match ? [match] : [];
        });

    return (
        <>
            <button type="button" className="btn-secondary text-sm" aria-label="Buscar" aria-keyshortcuts="Control+K Meta+K" onClick={openSearch}>
                <Search size={17} aria-hidden="true" /> <span className="compact-control-label">Buscar</span> <kbd aria-hidden="true" className="search-shortcut hidden xl:inline">Ctrl K</kbd>
            </button>
            <dialog ref={dialog} aria-labelledby="search-title" className="panel search-dialog fixed inset-0 m-auto w-[min(92vw,40rem)] p-5 text-[color:var(--text)]"
                onKeyDown={event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        event.currentTarget.close();
                    }
                }}>
                <div className="flex items-center justify-between gap-3">
                    <h2 id="search-title" className="text-xl font-bold">Buscar en DevForge</h2>
                    <button type="button" className="btn-secondary" onClick={() => dialog.current?.close()}>Cerrar</button>
                </div>
                <label className="mt-4 block" htmlFor="resource-query">Recurso, tecnología o tarea</label>
                <input id="resource-query" type="search" className="field mt-2" value={query} placeholder="Por ejemplo, SOAP"
                    onChange={event => setQuery(event.target.value)} autoFocus />
                <p role="status" className="subtle mt-3">{terms.length ? (matches.length ? matches.length + ' resultados' : 'No hay resultados') : matches.length ? 'Favoritos y recursos recientes' : 'Escribe para buscar.'}</p>
                <ul className="mt-3 divide-y divide-[color:var(--line)]">
                    {matches.map(([title, href, detail]) => (
                        <li key={href + title} className="flex items-center justify-between gap-2">
                            <Link className="block rounded px-2 py-3 hover:bg-[color:var(--surface-raised)]" href={href} onClick={() => {
                                const next = [href, ...recent.filter(item => item !== href)].slice(0, 8);
                                setRecent(next);
                                writeSaved('devforge-recent', next);
                                dialog.current?.close();
                            }}>
                                <span className="block font-semibold">{title}</span>
                                <span className="subtle text-sm">{detail}</span>
                            </Link>
                            <button type="button" aria-label={(favorites.includes(href) ? 'Quitar favorito: ' : 'Guardar favorito: ') + title}
                                aria-pressed={favorites.includes(href)} className="rounded border border-[color:var(--line)] px-3 py-2 text-sm"
                                onClick={() => {
                                    const next = favorites.includes(href) ? favorites.filter(item => item !== href) : [...favorites, href];
                                    setFavorites(next);
                                    writeSaved('devforge-favorites', next);
                                }}>{favorites.includes(href) ? '★' : '☆'}</button>
                        </li>
                    ))}
                </ul>
            </dialog>
        </>
    );
}
