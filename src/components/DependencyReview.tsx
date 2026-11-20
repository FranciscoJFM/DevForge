"use client";

import { useState } from 'react';

export default function DependencyReview() {
    const [rows, setRows] = useState<{ group: string; name: string; version: string }[]>([]);
    const [status, setStatus] = useState('');

    return <section id="dependencias" className="panel mt-8 scroll-mt-24 p-6">
        <h2 className="text-xl font-bold">Inventario de dependencias npm</h2>
        <p className="subtle mt-3">Pega un package.json para listar las dependencias directas. El inventario muestra rangos declarados. Para comprobar versiones instaladas y avisos de seguridad, revisa el lockfile y ejecuta la auditoría de tu gestor en el repositorio.</p>
        <form className="mt-5" onSubmit={event => {
            event.preventDefault();
            try {
                const manifest = JSON.parse(String(new FormData(event.currentTarget).get('manifest')));
                if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw Error();
                const result = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].flatMap(group => {
                    const entries = manifest[group];
                    if (entries === undefined) return [];
                    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) throw Error();
                    return Object.entries(entries).map(([name, version]) => {
                        if (typeof version !== 'string') throw Error();
                        return { group, name, version };
                    });
                });
                setRows(result);
                setStatus(result.length + ' entradas declaradas.');
            } catch {
                setRows([]);
                setStatus('Revisa el JSON y comprueba que cada dependencia tenga una versión de texto.');
            }
        }}>
            <label className="block">Contenido de package.json<textarea className="field mt-2 min-h-28 font-mono" name="manifest" required maxLength={150000} /></label>
            <button className="btn-primary mt-4" type="submit">Inventariar</button>
        </form>
        <p role="status" className="subtle mt-4">{status}</p>
        {rows.length > 0 && <ul className="mt-3 space-y-2">
            {rows.map(({ group, name, version }) => <li className="break-all" key={group + name}><strong>{name}</strong> · {version} <span className="subtle">({group})</span></li>)}
        </ul>}
    </section>;
}
