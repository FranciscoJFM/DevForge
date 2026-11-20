"use client";

import { useState } from 'react';

const scenes = [
    { title: 'Define el contrato', code: 'GET /api/items\nAccept: application/json', caption: 'Empieza por el contrato. Especifica el método, la ruta y el tipo de respuesta. Usa datos ficticios para probar.' },
    { title: 'Comprueba el estado', code: "const response = await fetch('/api/items');\nif (!response.ok) throw new Error('HTTP ' + response.status);", caption: 'Comprueba el estado HTTP antes de procesar la respuesta. Decide qué verá el usuario cuando haya un error.' },
    { title: 'Documenta un caso de prueba', code: '200 → mostrar la lista\n200 con [] → mostrar estado vacío\n500 → mostrar error y opción de reintentar', caption: 'Documenta un caso exitoso, uno sin resultados y un error. Así otra persona puede repetir tus pruebas.' },
];

export default function VideoEpisode() {
    const [index, setIndex] = useState(0);
    const [status, setStatus] = useState('');
    const scene = scenes[index];

    function changeScene(next: number) {
        window.speechSynthesis?.cancel();
        setStatus('');
        setIndex(next);
    }

    return <section className="panel mt-8 p-6" aria-labelledby="episode-title">
        <h2 id="episode-title" className="text-2xl font-bold">De una solicitud REST a una prueba reproducible</h2>
        <div className="mt-5 rounded-xl border border-[color:var(--input-line)] bg-[color:var(--well)] p-5">
            <h3 className="text-xl font-bold">{scene.title}</h3>
            <pre className="mt-4 overflow-auto whitespace-pre-wrap"><code>{scene.code}</code></pre>
            <p className="subtle mt-4" aria-live="polite">{scene.caption}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-secondary disabled:opacity-40" disabled={!index} onClick={() => changeScene(index - 1)}>Anterior</button>
            <button type="button" className="btn-secondary disabled:opacity-40" disabled={index === scenes.length - 1} onClick={() => changeScene(index + 1)}>Siguiente</button>
            <button type="button" className="btn-primary" onClick={() => {
                if (!('speechSynthesis' in window)) { setStatus('Tu navegador no ofrece narración. Puedes leer la transcripción.'); return; }
                window.speechSynthesis.cancel();
                const speech = new SpeechSynthesisUtterance(scene.caption);
                speech.lang = 'es-MX';
                speech.onerror = () => setStatus('La voz no está disponible. Puedes leer la transcripción.');
                window.speechSynthesis.speak(speech);
                setStatus('');
            }}>Escuchar escena</button>
            <button type="button" className="btn-secondary" onClick={() => window.speechSynthesis?.cancel()}>Detener narración</button>
        </div>
        <p role="status" className="subtle mt-3 text-sm">{status}</p>
        <details className="mt-5">
            <summary className="cursor-pointer font-semibold">Leer la transcripción completa</summary>
            <ol className="subtle mt-3 list-decimal space-y-2 pl-5">
                {scenes.map(item => <li key={item.title}>{item.caption}</li>)}
            </ol>
        </details>
    </section>;
}
