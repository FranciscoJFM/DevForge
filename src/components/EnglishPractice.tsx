"use client";

import { useEffect, useRef, useState } from 'react';

const exercises = [
    {
        title: 'Entrevista · Presentarte',
        prompt: 'Tell me about yourself and a project you worked on.',
        meaning: 'Cuéntame sobre ti y sobre un proyecto en el que trabajaste.',
        task: 'Explica qué haces, qué problema resolviste y cómo comprobaste el resultado.',
        example: 'I started in technical documentation and later moved into development. On one project, I documented a REST integration and wrote tests for its error responses. That helped the team reproduce issues before release.',
        vocabulary: ['I started in… · Empecé en…', 'I worked on… · Trabajé en…', 'before release · antes de liberar'],
    },
    {
        title: 'Salesforce · Explicar un cambio',
        prompt: 'How did you make the Apex trigger work with multiple records?',
        meaning: '¿Cómo hiciste que el trigger de Apex funcionara con varios registros?',
        task: 'Explica qué cambiaste, por qué y cómo lo probaste.',
        example: 'I moved the SOQL query outside the loop and collected the account IDs in a set. Then I tested the trigger with one record and with a batch of records.',
        vocabulary: ['outside the loop · fuera del bucle', 'collect IDs · reunir identificadores', 'a batch of records · un lote de registros'],
    },
    {
        title: 'Android · Reportar un error',
        prompt: 'What happens when the device goes offline?',
        meaning: '¿Qué pasa cuando el dispositivo pierde la conexión?',
        task: 'Describe el comportamiento esperado, lo que observaste y tu siguiente paso.',
        example: 'The app should show cached tasks. Instead, it shows a blank screen. I can reproduce the issue in airplane mode. I will check how the view model handles network errors.',
        vocabulary: ['cached tasks · tareas guardadas en caché', 'blank screen · pantalla en blanco', 'reproduce the issue · reproducir el error'],
    },
    {
        title: 'Web · Revisar un cambio',
        prompt: 'Could you walk me through this pull request?',
        meaning: '¿Podrías explicarme este pull request paso a paso?',
        task: 'Resume el cambio y pide una revisión concreta.',
        example: 'This pull request adds validation to the contact form. I tested empty input and network errors. Could you check whether the error message is easy to understand?',
        vocabulary: ['walk me through · explícame paso a paso', 'empty input · entrada vacía', 'error message · mensaje de error'],
    },
    {
        title: 'Trabajo · Aclarar prioridades',
        prompt: 'Can we add one more feature before Friday?',
        meaning: '¿Podemos añadir otra función antes del viernes?',
        task: 'Explica el impacto y ofrece una alternativa con una pregunta de seguimiento.',
        example: 'I can add it if we move the report to next week. If both need to ship on Friday, we should agree on a smaller scope. Which item should I prioritize?',
        vocabulary: ['ship on Friday · entregar el viernes', 'smaller scope · alcance más acotado', 'prioritize · dar prioridad'],
    },
];

export default function EnglishPractice() {
    const [selected, setSelected] = useState(0);
    const [drafts, setDrafts] = useState<Record<number, string>>({});
    const [showExample, setShowExample] = useState(false);
    const [status, setStatus] = useState('');
    const activeSpeech = useRef<SpeechSynthesisUtterance | null>(null);
    const exercise = exercises[selected];

    useEffect(() => () => {
        if (activeSpeech.current) window.speechSynthesis?.cancel();
    }, []);

    function speak(text: string) {
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
            setStatus('La voz no está disponible en este navegador. Puedes leer el texto en voz alta.');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        activeSpeech.current = utterance;
        setStatus('');
        utterance.onend = () => {
            if (activeSpeech.current === utterance) activeSpeech.current = null;
        };
        utterance.onerror = event => {
            if (activeSpeech.current !== utterance) return;
            activeSpeech.current = null;
            if (!['canceled', 'interrupted'].includes(event.error)) setStatus('No se pudo reproducir la voz. Puedes practicar con el texto.');
        };
        window.speechSynthesis.speak(utterance);
    }

    return <section id="practica" className="panel scroll-mt-24 p-5 md:p-7" aria-labelledby="english-practice">
        <h2 id="english-practice" className="section-title">Práctica con situaciones reales</h2>
        <label htmlFor="english-scenario" className="mt-4 block font-semibold">Situación</label>
        <select id="english-scenario" className="field mt-2" value={selected} onChange={event => {
            if (activeSpeech.current) window.speechSynthesis?.cancel();
            activeSpeech.current = null;
            setSelected(Number(event.target.value));
            setShowExample(false);
            setStatus('');
        }}>
            {exercises.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
        </select>
        <blockquote className="mt-5 border-l-2 border-[color:var(--accent)] pl-4 text-lg font-semibold" lang="en">{exercise.prompt}</blockquote>
        <p className="subtle mt-2">{exercise.meaning}</p>
        <button type="button" className="btn-secondary mt-3" onClick={() => speak(exercise.prompt)}>Escuchar pregunta</button>
        <label htmlFor="english-answer" className="mt-5 block font-semibold">Tu respuesta en inglés</label>
        <p id="english-instructions" className="subtle mt-1">{exercise.task}</p>
        <textarea id="english-answer" aria-describedby="english-instructions" className="field mt-2 min-h-28" lang="en"
            maxLength={2500} value={drafts[selected] ?? ''} onChange={event => {
                const value = event.target.value;
                setDrafts(current => ({ ...current, [selected]: value }));
            }} />
        <button type="button" className="btn-primary mt-4" aria-expanded={showExample} aria-controls="english-model" onClick={() => setShowExample(!showExample)}>
            {showExample ? 'Ocultar respuesta modelo' : 'Ver respuesta modelo'}
        </button>
        <div id="english-model" hidden={!showExample} className="mt-5 rounded-xl border border-[color:var(--line)] bg-[color:var(--well)] p-4">
            <p lang="en">{exercise.example}</p>
            <button type="button" className="btn-secondary mt-3" onClick={() => speak(exercise.example)}>Escuchar respuesta modelo</button>
            <ul className="subtle mt-4 list-disc space-y-1 pl-5">{exercise.vocabulary.map(term => {
                const [english, spanish] = term.split(' · ');
                return <li key={term}><span lang="en">{english}</span> · {spanish}</li>;
            })}</ul>
            <p className="subtle mt-4">Comprueba que respondiste la pregunta, usaste un ejemplo concreto y cerraste con un resultado o siguiente paso.</p>
        </div>
        {status && <p role="status" className="subtle mt-3">{status}</p>}
    </section>;
}
