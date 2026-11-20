"use client";

import Link from 'next/link';
import { useState } from 'react';

const samples = [
    {
        name: 'REST', path: 'GET /posts/1', format: 'JSON', href: '/integration-lab',
        title: 'Abrir Integration Lab',
        code: '{\n  "id": 1,\n  "title": "Primera publicación",\n  "description": "Registro ficticio"\n}',
    },
    {
        name: 'SOQL', path: 'Account', format: 'SOQL', href: '/herramientas#integraciones',
        title: 'Preparar una consulta',
        code: 'SELECT Id, Name, Industry\nFROM Account\nORDER BY Name\nLIMIT 10',
    },
    {
        name: 'JavaScript', path: 'practica.js', format: 'JS', href: '/playground',
        title: 'Abrir el editor',
        code: 'const items = [125, 250, 80];\nconst total = items.reduce(\n  (sum, item) => sum + item, 0\n);\nconsole.log(total); // 455',
    },
];

export default function HeroWorkbench() {
    const [active, setActive] = useState(0);
    const sample = samples[active];
    return <section className="hero-workbench" aria-label="Vista previa de herramientas">
        <div className="workbench-top">
            <div className="workbench-options" aria-label="Ejemplos disponibles">
                {samples.map((entry, index) => <button key={entry.name} type="button" aria-pressed={active === index}
                    onClick={() => setActive(index)}>{entry.name}</button>)}
            </div>
        </div>
        <div className="workbench-body">
            <div className="workbench-file">
                <code>{sample.path}</code>
                <span>{sample.format}</span>
            </div>
            <pre aria-live="polite"><code>{sample.code}</code></pre>
        </div>
        <div className="workbench-footer">
            <span>Ejemplo de práctica</span>
            <Link href={sample.href}>{sample.title}</Link>
        </div>
    </section>;
}
