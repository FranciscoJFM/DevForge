"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type WorkLog = {
    date: string;
    hours: string;
    guard: string;
    incident: string;
};

const emptyLog: WorkLog = { date: '', hours: '', guard: '', incident: '' };

export default function DevProtectWorkspace() {
    const [log, setLog] = useState<WorkLog>(emptyLog);
    const [style, setStyle] = useState('Colaborativo');
    const [situation, setSituation] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    function saveLog() {
        try {
            localStorage.setItem('devforge-work-protect', JSON.stringify(log));
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1800);
        } catch {
            setSaved(false);
        }
    }

    const response = style === 'Firme'
        ? `Entiendo la urgencia. Para evaluar la solicitud necesitamos confirmar el alcance, las dependencias y qué trabajo se pospone. Mi jornada acordada y mis responsabilidades personales deben respetarse. Propongo acordar una decisión concreta, responsable y fecha de seguimiento.`
        : style === 'Formal'
            ? `Solicito que revisemos por escrito el alcance, la prioridad y las condiciones extraordinarias de esta solicitud. Registraré el acuerdo alcanzado y haré seguimiento en la fecha acordada.`
            : `Entiendo la urgencia de esta entrega. Para definir una solución viable, revisemos el alcance, las dependencias y qué prioridad quedaría pendiente. Propongo acordar una fecha, responsable y criterio de aceptación.`;

    async function copyResponse() {
        try {
            await navigator.clipboard.writeText(response);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    function restoreLog() {
        try {
            const stored = localStorage.getItem('devforge-work-protect');
            if (!stored) return;
            const value = JSON.parse(stored) as WorkLog;
            setLog({
                date: value.date ?? '',
                hours: value.hours ?? '',
                guard: value.guard ?? '',
                incident: value.incident ?? '',
            });
        } catch {
            setLog(emptyLog);
        }
    }

    return (
        <section className="devprotect-workspace panel mt-8 p-5 md:p-7" aria-labelledby="devprotect-title">
            <h2 id="devprotect-title" className="text-2xl font-bold">DevProtect privado en este navegador</h2>
            <p className="subtle mt-2">Guarda solo hechos y acuerdos necesarios. No se publica ni se sincroniza con un servidor.</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label><span className="mb-2 block font-semibold">Fecha</span><input className="field" type="date" value={log.date} onChange={event => setLog(current => ({ ...current, date: event.target.value }))} /></label>
                        <label><span className="mb-2 block font-semibold">Horas adicionales</span><input className="field" type="number" min="0" step="0.25" value={log.hours} onChange={event => setLog(current => ({ ...current, hours: event.target.value }))} /></label>
                    </div>
                    <label className="mt-3 block"><span className="mb-2 block font-semibold">Guardias o mensajes fuera de horario</span><textarea className="field min-h-24" value={log.guard} onChange={event => setLog(current => ({ ...current, guard: event.target.value }))} /></label>
                    <label className="mt-3 block"><span className="mb-2 block font-semibold">Hechos y acuerdos observables</span><textarea className="field min-h-28" value={log.incident} onChange={event => setLog(current => ({ ...current, incident: event.target.value }))} /></label>
                    <button type="button" className="btn-primary mt-4" onClick={saveLog}>{saved ? <><Check size={16} /> Guardado</> : 'Guardar privado'}</button>
                    <button type="button" className="btn-secondary mt-4 ml-2" onClick={restoreLog}>Restaurar</button>
                </div>
                <div>
                    <label className="block"><span className="mb-2 block font-semibold">Estilo de respuesta</span><select className="field" value={style} onChange={event => setStyle(event.target.value)}><option>Colaborativo</option><option>Firme</option><option>Formal</option></select></label>
                    <label className="mt-3 block"><span className="mb-2 block font-semibold">Situación que quieres responder</span><textarea className="field min-h-24" value={situation} onChange={event => setSituation(event.target.value)} placeholder="Ejemplo: me piden entregar una integración hoy..." /></label>
                    <pre className="field mt-4 min-h-36 whitespace-pre-wrap text-sm" aria-live="polite"><code>{situation ? `${response}\n\nContexto: ${situation}` : response}</code></pre>
                    <button type="button" className="btn-secondary mt-3" onClick={copyResponse}>{copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar respuesta</>}</button>
                </div>
            </div>
        </section>
    );
}
