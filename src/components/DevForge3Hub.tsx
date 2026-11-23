"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Feature = {
    id: string;
    number: number;
    name: string;
    category: 'Técnico' | 'Profesional';
    summary: string;
    steps: string[];
    href: string;
};

const features: Feature[] = [
    { id: 'devdoctor', number: 1, name: 'DevDoctor', category: 'Técnico', summary: 'Diagnóstico de errores con hipótesis, evidencia, corrección y validación.', steps: ['Identifica síntoma y entorno', 'Reproduce con datos mínimos', 'Separa hipótesis y evidencia', 'Ejecuta una prueba verificable'], href: '/debug' },
    { id: 'architecture', number: 2, name: 'Architecture Visualizer', category: 'Técnico', summary: 'Convierte componentes, dependencias y flujos en una descripción arquitectónica local.', steps: ['Enumera componentes', 'Define límites y dependencias', 'Describe el flujo principal', 'Genera riesgos y decisiones'], href: '/project-builder' },
    { id: 'testforge', number: 3, name: 'TestForge', category: 'Técnico', summary: 'Prepara casos unitarios, integración, negativos y escenarios límite.', steps: ['Define el contrato', 'Añade caso positivo', 'Añade casos negativos y límites', 'Documenta el resultado esperado'], href: '/retos' },
    { id: 'performance', number: 4, name: 'Performance Lab', category: 'Técnico', summary: 'Compara soluciones con condiciones de prueba documentadas.', steps: ['Define escenario medible', 'Establece datos y carga', 'Mide latencia o tiempo', 'Compara con límites acordados'], href: '/debug' },
    { id: 'database', number: 5, name: 'Database Doctor', category: 'Técnico', summary: 'Revisa consultas SQL y SOQL, patrones costosos e índices.', steps: ['Analiza filtros y joins', 'Identifica consultas dentro de bucles', 'Revisa índices disponibles', 'Obtén y compara el plan'], href: '/herramientas#integraciones' },
    { id: 'git', number: 6, name: 'Git Rescue Simulator', category: 'Técnico', summary: 'Practica conflictos, rebase, revert y recuperación sin modificar repositorios reales.', steps: ['Crea un escenario ficticio', 'Compara el historial', 'Elige una operación', 'Verifica qué puede recuperarse'], href: '/git' },
    { id: 'release', number: 7, name: 'Release Guardian', category: 'Técnico', summary: 'Valida pruebas, dependencias, versionado y reversión antes de liberar.', steps: ['Revisa alcance y dependencias', 'Confirma pruebas y versión', 'Define el procedimiento de rollback', 'Documenta aprobaciones'], href: '/documentos?plantilla=liberacion' },
    { id: 'knowledge', number: 8, name: 'Error Knowledge Base', category: 'Técnico', summary: 'Estructura errores anonimizados con causa raíz, solución y comprobación.', steps: ['Anonimiza el caso', 'Describe causa y entorno', 'Añade la corrección', 'Incluye cómo validar'], href: '/debug' },
    { id: 'legacy', number: 9, name: 'Legacy Code Explorer', category: 'Técnico', summary: 'Mapea responsabilidades, dependencias y riesgos de refactorización.', steps: ['Identifica entradas y responsabilidades', 'Marca dependencias externas', 'Separa riesgo alto y bajo', 'Propón cambios incrementales'], href: '/revision-codigo' },
    { id: 'config', number: 10, name: 'Config Diff', category: 'Técnico', summary: 'Compara entornos sin incluir credenciales ni secretos.', steps: ['Genera claves ficticias o anonimizadas', 'Compara DEV, QA y PROD', 'Explica diferencias relevantes', 'Define el valor esperado'], href: '/herramientas' },
    { id: 'mentor', number: 11, name: 'DevMentor', category: 'Profesional', summary: 'Organiza mentorías por nivel, objetivo y especialidad.', steps: ['Define nivel y objetivo', 'Selecciona especialidad', 'Prepara una conversación', 'Acuerda una meta verificable'], href: '/academia' },
    { id: 'interview', number: 12, name: 'DevInterview Arena', category: 'Profesional', summary: 'Prepara entrevistas técnicas y recibe una rúbrica local de respuestas.', steps: ['Lee el problema', 'Explica el enfoque', 'Expresa supuestos y trade-offs', 'Revisa complejidad y pruebas'], href: '/entrevistas' },
    { id: 'salary', number: 13, name: 'DevSalary Simulator', category: 'Profesional', summary: 'Compara ofertas con salario, prestaciones, guardias y condiciones.', steps: ['Anota salario bruto y neto', 'Incluye prestaciones y guardias', 'Compara horarios y responsabilidades', 'Prepara preguntas'], href: '/analizar-vacante' },
    { id: 'rights', number: 14, name: 'DevRights Academy', category: 'Profesional', summary: 'Aprende límites laborales y cuándo buscar orientación externa.', steps: ['Identifica la situación', 'Registra hechos observables', 'Separa derecho de política interna', 'Busca apoyo especializado'], href: '/trabajo-sostenible' },
    { id: 'negotiator', number: 15, name: 'DevNegotiator Pro', category: 'Profesional', summary: 'Prepara conversaciones sobre carga, salario, alcance y acuerdos.', steps: ['Define el resultado requerido', 'Explica el impacto con hechos', 'Presenta alternativas', 'Pide un acuerdo y seguimiento'], href: '/empleo' },
    { id: 'sprint', number: 16, name: 'Sprint Simulator', category: 'Profesional', summary: 'Practica planificación, cambios de alcance y negociación de prioridades.', steps: ['Define capacidad disponible', 'Selecciona prioridad', 'Evalúa una incorporación tardía', 'Propón alternativas'], href: '/project-builder' },
    { id: 'arena', number: 17, name: 'AI Verification Arena', category: 'Profesional', summary: 'Revisa código generado por IA antes de integrarlo.', steps: ['Aísla el cambio', 'Busca secretos y vulnerabilidades', 'Diseña casos límite', 'Ejecuta pruebas y revisa licencia'], href: '/ia-responsable' },
    { id: 'portfolio', number: 18, name: 'DevPortfolio Generator', category: 'Profesional', summary: 'Convierte proyectos en evidencia verificable.', steps: ['Describe el problema', 'Explica tu responsabilidad', 'Incluye enlace y pruebas', 'Añade métricas verificables'], href: '/portafolio' },
    { id: 'opensource', number: 19, name: 'Open Source Hub', category: 'Profesional', summary: 'Prepara una contribución con alcance pequeño y comprobable.', steps: ['Lee el proyecto y reglas', 'Busca una issue pequeña', 'Prepara el entorno', 'Documenta y prueba el cambio'], href: '/proyectos' },
    { id: 'navigator', number: 20, name: 'DevCareer Navigator', category: 'Profesional', summary: 'Construye un plan de habilidades, nivel y objetivos.', steps: ['Evalúa el nivel actual', 'Selecciona el próximo rol', 'Detecta brechas', 'Crea evidencia y fechas'], href: '/trayectoria' },
];

export default function DevForge3Hub() {
    const [category, setCategory] = useState<'Todos' | 'Técnico' | 'Profesional'>('Todos');
    const [selectedId, setSelectedId] = useState(features[0].id);
    const [context, setContext] = useState('');
    const [copied, setCopied] = useState(false);
    const selected = features.find(feature => feature.id === selectedId) ?? features[0];
    const visible = useMemo(
        () => category === 'Todos' ? features : features.filter(feature => feature.category === category),
        [category],
    );

    const plan = `${selected.number}. ${selected.name}

Contexto:
${context.trim() || '[Describe aquí el problema, entorno y restricciones sin incluir secretos.]'}

Plan de trabajo:
${selected.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Criterio de finalización:
El resultado debe incluir evidencia observable, una prueba realizada y una limitación conocida.`;

    async function copyPlan() {
        try {
            await navigator.clipboard.writeText(plan);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div>
            <div className="devforge3-filters" aria-label="Filtrar funcionalidades">
                {(['Todos', 'Técnico', 'Profesional'] as const).map(item => (
                    <button key={item} type="button" className="btn-secondary" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
                ))}
            </div>
            <div className="devforge3-layout mt-6">
                <section className="devforge3-grid" aria-label="Funcionalidades de DevForge 3.0">
                    {visible.map(feature => (
                        <button
                            key={feature.id}
                            type="button"
                            className="devforge3-card"
                            aria-pressed={selected.id === feature.id}
                            onClick={() => setSelectedId(feature.id)}
                        >
                            <span>{String(feature.number).padStart(2, '0')}</span>
                            <strong>{feature.name}</strong>
                            <small>{feature.category}</small>
                            <p>{feature.summary}</p>
                        </button>
                    ))}
                </section>
                <aside className="devforge3-plan" aria-live="polite">
                    <p className="mini-tag">{selected.category}</p>
                    <h2>{selected.name}</h2>
                    <p>{selected.summary}</p>
                    <label className="mt-5 block">
                        <span className="mb-2 block font-bold">Contexto o objetivo</span>
                        <textarea className="field min-h-28" value={context} onChange={event => setContext(event.target.value)} placeholder="Ejemplo: una API devuelve 500 al procesar pagos ficticios..." />
                    </label>
                    <ol>
                        {selected.steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}
                    </ol>
                    <div className="flex flex-wrap gap-3">
                        <Link className="btn-primary" href={selected.href}>Abrir herramienta</Link>
                        <button type="button" className="btn-secondary" onClick={copyPlan}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copiado' : 'Copiar plan'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
