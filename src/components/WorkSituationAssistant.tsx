"use client";

import Link from 'next/link';
import { useState } from 'react';

const situations = [
    {
        id: 'hours',
        label: 'Me hacen trabajar horas extra',
        title: 'Ordena los hechos y acuerda una compensación',
        description: 'Registra fechas, horas, guardias y acuerdos relacionados con el trabajo. Revisa la carga real antes de pedir una decisión.',
        action: 'Usar el kit de trabajo sostenible',
        href: '/trabajo-sostenible',
    },
    {
        id: 'abuse',
        label: 'Mi jefe me grita o humilla',
        title: 'Haz una bitácora privada y busca un canal seguro',
        description: 'Anota hechos observables, fechas y respuestas. Conserva la información en un lugar seguro y evita publicar nombres o datos sensibles.',
        action: 'Preparar cómo pedir apoyo',
        href: '/empleo',
    },
    {
        id: 'growth',
        label: 'No me dejan crecer profesionalmente',
        title: 'Convierte tus logros en evidencia',
        description: 'Describe objetivos cumplidos, entregables y habilidades adquiridas. Usa esa información para pedir retroalimentación y un plan concreto.',
        action: 'Crear un plan de trayectoria',
        href: '/trayectoria',
    },
    {
        id: 'scope',
        label: 'Me exigen terminar algo imposible',
        title: 'Explica el alcance y presenta opciones',
        description: 'Separa lo solicitado de lo que ya está comprometido. Identifica riesgos, dependencias y qué tendría que posponerse.',
        action: 'Usar plantillas de alcance',
        href: '/herramientas#plantillas',
    },
    {
        id: 'offer',
        label: 'Me ofrecieron un empleo sospechoso',
        title: 'Verifica antes de compartir datos o pagar',
        description: 'Confirma el dominio, la empresa y el proceso por canales oficiales. Revisa salario, modalidad, contrato y pruebas técnicas por escrito.',
        action: 'Revisar una vacante',
        href: '/analizar-vacante',
    },
];

export default function WorkSituationAssistant() {
    const [selected, setSelected] = useState(situations[0].id);
    const situation = situations.find(item => item.id === selected) ?? situations[0];

    return (
        <section className="situation-assistant panel" aria-labelledby="situation-assistant-title">
            <div>
                <p className="hero-topic">Orientación inicial</p>
                <h2 id="situation-assistant-title" className="section-title mt-2">¿Me está pasando esto?</h2>
                <p className="subtle mt-3">
                    Elige una situación para obtener un siguiente paso concreto. Esta herramienta no guarda ni comparte tu selección.
                </p>
                <div className="situation-options" aria-label="Situaciones laborales">
                    {situations.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            aria-pressed={selected === item.id}
                            onClick={() => setSelected(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <article className="situation-result" aria-live="polite">
                <p className="mini-tag">Siguiente paso</p>
                <h3>{situation.title}</h3>
                <p>{situation.description}</p>
                <Link href={situation.href} className="btn-primary">{situation.action}</Link>
                <p className="situation-privacy">Orientación general. No reemplaza asesoría jurídica ni representa una respuesta oficial de tu empresa o país.</p>
            </article>
        </section>
    );
}
