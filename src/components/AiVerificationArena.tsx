"use client";

import { useState } from 'react';

const cases = [
    {
        title: 'Solicitud sin límite de intentos',
        code: `async function request(url: string) {\n  return fetch(url).then(response => response.json());\n}`,
        bugs: ['No maneja errores HTTP', 'Puede aceptar una respuesta no JSON', 'No aplica timeout ni límite de reintentos'],
        checks: ['Prueba 500 y 429', 'Verifica JSON inválido', 'Comprueba AbortController'],
    },
    {
        title: 'Comparación de permisos',
        code: `function canEdit(user: { role: string }) {\n  return user.role === "admin" || user.role === "editor";\n}`,
        bugs: ['No valida usuario nulo', 'El rol puede llegar de entrada no confiable', 'No distingue permiso por recurso'],
        checks: ['Prueba usuario ausente', 'Distingue editor de recurso ajeno', 'Valida autorización en el servidor'],
    },
    {
        title: 'Consulta sin datos límite',
        code: `const products = await db.query("SELECT * FROM product");`,
        bugs: ['Sin paginación', 'Sin filtros ni límite', 'Puede exponer datos no requeridos'],
        checks: ['Añade límite y paginación', 'Selecciona columnas necesarias', 'Prueba colección vacía'],
    },
];

export default function AiVerificationArena() {
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const item = cases[index];

    function choose(answer: string) {
        setSelected(current => current.includes(answer)
            ? current.filter(value => value !== answer)
            : [...current, answer]);
    }

    return (
        <section className="panel mt-8 p-6" aria-labelledby="ai-arena-title">
            <h2 id="ai-arena-title" className="text-2xl font-bold">AI Verification Arena</h2>
            <p className="subtle mt-2">Examina código deliberadamente incompleto. Después compara tus hallazgos y diseña pruebas.</p>
            <label className="mt-5 block"><span className="mb-2 block font-semibold">Caso</span><select className="field" value={index} onChange={event => { setIndex(Number(event.target.value)); setRevealed(false); setSelected([]); }}>{cases.map((item, position) => <option key={item.title} value={position}>{item.title}</option>)}</select></label>
            <pre className="field mt-4 overflow-auto text-sm"><code>{item.code}</code></pre>
            <fieldset className="mt-5">
                <legend className="font-semibold">Marca riesgos que identificaste</legend>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {[...item.bugs, ...item.checks].map(answer => <label key={answer} className="flex items-start gap-3 rounded-lg border border-[color:var(--line)] p-3"><input type="checkbox" className="mt-1" checked={selected.includes(answer)} onChange={() => choose(answer)} /><span>{answer}</span></label>)}
                </div>
            </fieldset>
            <button type="button" className="btn-primary mt-5" aria-expanded={revealed} onClick={() => setRevealed(current => !current)}>{revealed ? 'Ocultar solución' : 'Revelar criterios'}</button>
            {revealed && <div className="mt-5 grid gap-4 md:grid-cols-2" role="status">
                <div className="rounded-xl border border-[color:var(--line)] p-4"><h3 className="font-bold">Riesgos esperados</h3><ul className="subtle mt-3 list-disc space-y-2 pl-5">{item.bugs.map(bug => <li key={bug}>{bug}</li>)}</ul></div>
                <div className="rounded-xl border border-[color:var(--line)] p-4"><h3 className="font-bold">Pruebas esperadas</h3><ul className="subtle mt-3 list-disc space-y-2 pl-5">{item.checks.map(check => <li key={check}>{check}</li>)}</ul></div>
            </div>}
        </section>
    );
}
