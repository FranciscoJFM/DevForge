"use client";

import { useMemo, useState } from 'react';
import { Check, Copy, ShieldAlert } from 'lucide-react';

const objectives = [
    'Diagnosticar un error',
    'Diseñar pruebas',
    'Revisar código',
    'Proponer arquitectura',
];

const technologies = [
    'Next.js / TypeScript',
    'Salesforce / Apex',
    'Android / Kotlin',
    'JavaScript / TypeScript',
    'Python',
    'Java',
    'Sin tecnología específica',
];

function findSensitiveData(context: string) {
    const checks = [
        { pattern: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*\S+/i, label: 'una posible clave, secreto o contraseña' },
        { pattern: /bearer\s+[a-z0-9._~-]+/i, label: 'un token Bearer' },
        { pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i, label: 'una clave privada' },
        { pattern: /\b(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i, label: 'una dirección de correo' },
    ];

    return checks.filter(({ pattern }) => pattern.test(context)).map(({ label }) => label);
}

export default function PromptBuilder() {
    const [objective, setObjective] = useState(objectives[0]);
    const [technology, setTechnology] = useState(technologies[0]);
    const [context, setContext] = useState('');
    const [copied, setCopied] = useState(false);

    const sensitiveData = useMemo(() => findSensitiveData(context), [context]);
    const prompt = `Actúa como un ingeniero de software senior especializado en ${technology}.

Objetivo: ${objective}.

Contexto:
${context.trim() || '[Describe aquí hechos comprobables, pasos reproducibles y restricciones.]'}

Instrucciones:
1. Identifica la información faltante y no inventes datos.
2. Separa hechos, hipótesis y riesgos.
3. Propón soluciones ordenadas por impacto y esfuerzo.
4. Incluye pruebas concretas para verificar cada solución.
5. Explica trade-offs, compatibilidad y posibles regresiones.
6. No solicites secretos, tokens, datos personales ni archivos innecesarios.
7. Si falta evidencia, indica cómo obtenerla de forma segura.

Resultado esperado:
Una breve explicación de la causa probable, una lista de opciones con riesgos, los cambios o pruebas propuestas y criterios de aceptación observables.`;

    async function copyPrompt() {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <section className="prompt-builder panel mt-8 p-5 md:p-7" aria-labelledby="prompt-builder-title">
            <div>
                <p className="mini-tag">Se ejecuta en tu navegador</p>
                <h2 id="prompt-builder-title" className="mt-3 text-2xl font-bold">DevForge Prompt Builder</h2>
                <p className="subtle mt-2 leading-7">
                    Construye una instrucción que separa hechos, hipótesis y verificaciones. El contenido no se envía a ningún servidor.
                </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label>
                    <span className="mb-2 block font-bold">¿Qué necesitas hacer?</span>
                    <select className="field" value={objective} onChange={event => setObjective(event.target.value)}>
                        {objectives.map(item => <option key={item}>{item}</option>)}
                    </select>
                </label>
                <label>
                    <span className="mb-2 block font-bold">Tecnología</span>
                    <select className="field" value={technology} onChange={event => setTechnology(event.target.value)}>
                        {technologies.map(item => <option key={item}>{item}</option>)}
                    </select>
                </label>
            </div>

            <label className="mt-4 block">
                <span className="mb-2 block font-bold">Contexto o problema</span>
                <textarea
                    className="field min-h-32"
                    value={context}
                    onChange={event => setContext(event.target.value)}
                    placeholder="Ejemplo: Una petición a la API devuelve HTTP 500 de forma intermitente. Incluye pasos, logs anonimizados y restricciones."
                />
            </label>

            {sensitiveData.length > 0 && (
                <p className="mt-3 flex gap-2 rounded-lg border border-[color:var(--danger)] p-3 text-sm" role="alert">
                    <ShieldAlert size={18} className="shrink-0" aria-hidden="true" />
                    Posible información sensible detectada: {sensitiveData.join(', ')}. Reemplázala por ejemplos ficticios antes de compartir el prompt.
                </p>
            )}

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-bold">Prompt generado</h3>
                    <button type="button" className="btn-secondary" onClick={copyPrompt}>
                        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
                <pre className="field max-h-[28rem] overflow-auto whitespace-pre-wrap text-sm" aria-live="polite"><code>{prompt}</code></pre>
            </div>
        </section>
    );
}
