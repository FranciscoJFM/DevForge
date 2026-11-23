"use client";

import Link from 'next/link';
import { useState } from 'react';

type RescueOption = {
    id: string;
    label: string;
    title: string;
    description: string;
    steps: string[];
    action: string;
    href: string;
};

const options: RescueOption[] = [
    {
        id: 'code',
        label: 'Mi código falla',
        title: 'Reproduce el error antes de cambiarlo',
        description: 'Toma el mensaje exacto, los pasos reproducibles y el entorno. Usa evidencia mínima antes de aplicar una hipótesis.',
        steps: ['Recopila el síntoma y el entorno', 'Busca el caso parecido en Debug Lab', 'Aplica una corrección pequeña', 'Ejecuta una prueba que confirme el resultado'],
        action: 'Abrir Debug Lab',
        href: '/debug',
    },
    {
        id: 'release',
        label: 'Falló mi despliegue',
        title: 'Conserva el estado y prepara la reversión',
        description: 'Separa el error del servicio desplegado. Identifica qué cambió y decide si conviene revertir, corregir o detener el rollout.',
        steps: ['Revisa logs y última versión desplegada', 'Confirma dependencias y variables', 'Ejecuta el checklist de liberación', 'Documenta la corrección y su prueba'],
        action: 'Preparar una entrega',
        href: '/documentos?plantilla=liberacion',
    },
    {
        id: 'work',
        label: 'Me exigen algo imposible',
        title: 'Documenta el alcance y presenta opciones',
        description: 'Haz visible el costo del cambio sin confrontar a la persona. Presenta prioridades, riesgos y decisiones posibles.',
        steps: ['Describe el alcance solicitado', 'Identifica dependencias y trabajo pospuesto', 'Proporciona alternativas con riesgos', 'Deja por escrito la decisión acordada'],
        action: 'Usar el asistente de trabajo',
        href: '/trabajo-sostenible',
    },
    {
        id: 'learn',
        label: 'No entiendo una tecnología',
        title: 'Empieza por un objetivo pequeño',
        description: 'Elige una ruta, identifica qué necesitas demostrar y practica con un ejercicio verificable.',
        steps: ['Define el problema que quieres resolver', 'Elige una ruta y una unidad breve', 'Completa un laboratorio', 'Guarda el resultado como evidencia'],
        action: 'Explorar rutas',
        href: '/academia',
    },
    {
        id: 'ai',
        label: 'La IA generó código incorrecto',
        title: 'No confíes: revisa y verifica',
        description: 'Separa el código generado de lo que realmente está probado. Revisa seguridad, integración y comportamiento antes de aceptarlo.',
        steps: ['Aísla el cambio y revisa el diff', 'Busca secretos y dependencias nuevas', 'Construye casos positivos y negativos', 'Ejecuta pruebas y registra las faltantes'],
        action: 'Abrir IA responsable',
        href: '/ia-responsable',
    },
];

export default function RescueCenter() {
    const [selected, setSelected] = useState(options[0].id);
    const rescue = options.find(option => option.id === selected) ?? options[0];

    return (
        <section className="rescue-center" aria-labelledby="rescue-title">
            <header>
                <p className="hero-topic">DevForge Rescue Center</p>
                <h1 id="rescue-title">¿Qué necesitas resolver hoy?</h1>
                <p>Selecciona el problema. DevForge te dará un flujo práctico con herramientas existentes.</p>
            </header>
            <div className="rescue-layout">
                <div className="rescue-options" aria-label="Tipos de problema">
                    {options.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={selected === option.id}
                            onClick={() => setSelected(option.id)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <article className="rescue-plan" aria-live="polite">
                    <p className="mini-tag">Diagnóstico inicial</p>
                    <h2>{rescue.title}</h2>
                    <p>{rescue.description}</p>
                    <ol>
                        {rescue.steps.map((step, index) => (
                            <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>
                        ))}
                    </ol>
                    <Link className="btn-primary" href={rescue.href}>{rescue.action}</Link>
                </article>
            </div>
        </section>
    );
}
