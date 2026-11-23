"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';

const tools = [
    { name: 'Document Studio', detail: 'Word, PDF, Excel y Markdown', need: 'Documentar', technology: 'General', href: '/documentos' },
    { name: 'Expediente de proyecto', detail: 'Decisiones, pruebas y capturas', need: 'Documentar', technology: 'General', href: '/expediente' },
    { name: 'Cliente HTTP', detail: 'Peticiones reales desde el navegador', need: 'Resolver', technology: 'Web', href: '/cliente-http' },
    { name: 'Integration Lab', detail: 'REST, SOAP y CRUD simulado', need: 'Resolver', technology: 'Salesforce', href: '/integration-lab' },
    { name: 'API Studio', detail: 'Contratos y clientes REST/SOAP', need: 'Construir', technology: 'Salesforce', href: '/api-studio' },
    { name: 'Playground', detail: 'Editor y retos JavaScript', need: 'Aprender', technology: 'JavaScript', href: '/playground' },
    { name: 'Debug Lab', detail: 'Diagnóstico de errores', need: 'Resolver', technology: 'General', href: '/debug' },
    { name: 'Revisión de código', detail: 'Clean Code, SOLID y seguridad', need: 'Construir', technology: 'General', href: '/revision-codigo' },
    { name: 'Git Rescue', detail: 'Comandos y recuperación', need: 'Resolver', technology: 'Git', href: '/git' },
    { name: 'IA responsable', detail: 'Prompts y revisión antes de integrar', need: 'Construir', technology: 'IA', href: '/ia-responsable' },
    { name: 'Project Builder', detail: 'Requisitos, arquitectura y entregas', need: 'Construir', technology: 'General', href: '/project-builder' },
    { name: 'Trabajo sostenible', detail: 'Límites, acuerdos y apoyo', need: 'Protegerme', technology: 'General', href: '/trabajo-sostenible' },
    { name: 'Entrevista técnica', detail: 'Práctica y criterios verificables', need: 'Crecer', technology: 'General', href: '/entrevistas' },
];

export default function ToolsWorkspace() {
    const [need, setNeed] = useState('Todos');
    const [technology, setTechnology] = useState('Todos');
    const [query, setQuery] = useState('');

    const visible = useMemo(() => tools.filter(tool => {
        const matchesNeed = need === 'Todos' || tool.need === need;
        const matchesTechnology = technology === 'Todos' || tool.technology === technology;
        const matchesQuery = !query || `${tool.name} ${tool.detail} ${tool.need} ${tool.technology}`.toLowerCase().includes(query.toLowerCase());
        return matchesNeed && matchesTechnology && matchesQuery;
    }), [need, technology, query]);

    return (
        <section className="tools-workspace panel mt-8 p-5" aria-labelledby="tools-workspace-title">
            <h2 id="tools-workspace-title" className="text-2xl font-bold">Encuentra tu siguiente herramienta</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
                <label><span className="mb-2 block font-semibold">Necesidad</span><select className="field" value={need} onChange={event => setNeed(event.target.value)}>{['Todos', 'Resolver', 'Aprender', 'Construir', 'Documentar', 'Protegerme', 'Crecer'].map(item => <option key={item}>{item}</option>)}</select></label>
                <label><span className="mb-2 block font-semibold">Tecnología</span><select className="field" value={technology} onChange={event => setTechnology(event.target.value)}>{['Todos', 'General', 'Salesforce', 'JavaScript', 'Web', 'Git', 'IA'].map(item => <option key={item}>{item}</option>)}</select></label>
                <label><span className="mb-2 block font-semibold">Buscar</span><input className="field" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ejemplo: SOQL" /></label>
            </div>
            <p role="status" className="subtle mt-4">{visible.length} herramientas disponibles</p>
            <div className="quick-tools mt-4">
                {visible.map(tool => <Link key={tool.href} href={tool.href} className="quick-tool">
                    <span><strong>{tool.name}</strong><span>{tool.detail}</span><span className="mt-2 flex flex-wrap gap-2"><span className="mini-tag">{tool.need}</span><span className="mini-tag">{tool.technology}</span></span></span>
                </Link>)}
            </div>
        </section>
    );
}
