"use client";

import { useState } from 'react';
import Link from 'next/link';

const routes = [
    {
        label: 'De Java a Salesforce Apex',
        reuse: 'Clases, interfaces, excepciones y diseño de pruebas.',
        learn: 'SOQL, operaciones sobre registros y límites de la plataforma.',
        exercise: 'Consulta un grupo de cuentas y prueba la lógica con varios registros en una sola ejecución.',
    },
    {
        label: 'De Android a React',
        reuse: 'Estado de pantalla, componentes y consumo de APIs.',
        learn: 'DOM, accesibilidad con teclado y manejo de formularios web.',
        exercise: 'Recrea una pantalla de búsqueda y comprueba sus estados de carga, error y lista vacía.',
    },
    {
        label: 'De React a Android',
        reuse: 'Composición de interfaces, estado y separación de la lógica de presentación.',
        learn: 'Kotlin, ciclo de vida de Android y navegación con Jetpack Compose.',
        exercise: 'Lleva una lista con filtros a Compose y conserva el estado al girar la pantalla.',
    },
    {
        label: 'De documentación a desarrollo de integraciones',
        reuse: 'Mapeo de flujos, contratos, ejemplos y criterios de aceptación.',
        learn: 'Métodos HTTP, formatos de respuesta y pruebas con datos ficticios.',
        exercise: 'Documenta un GET y construye un cliente sencillo que maneje una respuesta válida y un error.',
    },
];

export default function StackRoutes() {
    const [selected, setSelected] = useState(0);
    const route = routes[selected];

    return (
        <section id="cambiar-de-stack" className="panel mt-12 scroll-mt-24 p-6" aria-labelledby="stack-heading">
            <h2 id="stack-heading" className="section-title">Lo que ya sabes viaja contigo</h2>
            <p className="subtle mt-3">Elige una transición y practica con un problema que ya conozcas.</p>
            <label htmlFor="stack-route" className="mt-5 block font-semibold">Ruta para cambiar de stack</label>
            <select id="stack-route" className="field mt-2 max-w-xl" value={selected}
                onChange={event => setSelected(Number(event.target.value))}>
                {routes.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
            </select>
            <dl className="mt-5 grid gap-4 md:grid-cols-3" aria-live="polite">
                <div><dt className="font-semibold">Lo que ya puedes aplicar</dt><dd className="subtle mt-2">{route.reuse}</dd></div>
                <div><dt className="font-semibold">Lo que toca aprender</dt><dd className="subtle mt-2">{route.learn}</dd></div>
                <div><dt className="font-semibold">Primer ejercicio</dt><dd className="subtle mt-2">{route.exercise}</dd></div>
            </dl>
            <Link href="/trayectoria" className="btn-secondary mt-6">Leer de documentación a desarrollo</Link>
        </section>
    );
}