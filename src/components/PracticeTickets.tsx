"use client";

import Link from 'next/link';
import { useState } from 'react';
import { practiceTickets } from '@/lib/practiceTickets';

export default function PracticeTickets() {
    const [selected, setSelected] = useState(0);
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const ticket = practiceTickets[selected];

    return <section className="panel mt-8 p-5 md:p-7" aria-label="Ticket de práctica">
        <label className="block font-semibold" htmlFor="practice-ticket">Elige un ticket</label>
        <select id="practice-ticket" className="field mt-2" value={selected} onChange={event => setSelected(Number(event.target.value))}>
            {practiceTickets.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}
        </select>
        <article className="mt-6">
            <p className="text-sm font-semibold text-[color:var(--accent)]">{ticket.stack}</p>
            <h2 className="section-title mt-1">{ticket.title}</h2>
            <p className="subtle mt-3">{ticket.report}</p>
            <h3 className="mt-4 font-bold">Cómo reproducirlo</h3>
            <p className="subtle mt-1">{ticket.reproduce}</p>
            <pre className="field mt-3 overflow-auto text-sm"><code>{ticket.context}</code></pre>
            <h3 className="mt-5 font-bold">Criterios de aceptación</h3>
            <ul className="subtle mt-2 list-disc space-y-1 pl-5">{ticket.acceptance.map(item => <li key={item}>{item}</li>)}</ul>
            <label className="mt-5 block font-semibold" htmlFor="ticket-draft">Tu diagnóstico, solución y pruebas</label>
            <textarea id="ticket-draft" className="field mt-2 min-h-36" value={drafts[ticket.id] ?? ''} maxLength={5000}
                placeholder="Qué observaste, qué cambiarías y cómo comprobarías el resultado"
                onChange={event => {
                    const value = event.target.value;
                    setDrafts(current => ({ ...current, [ticket.id]: value }));
                }} />
            <details className="mt-5 rounded-xl border border-[color:var(--line)] bg-[color:var(--well)] p-4" key={ticket.id}>
                <summary className="cursor-pointer font-semibold">Ver solución comentada</summary>
                <p className="subtle mt-3">{ticket.solution}</p>
                <pre className="field mt-3 overflow-auto whitespace-pre-wrap text-sm"><code>{ticket.code}</code></pre>
                <h3 className="mt-4 font-bold">Cómo comprobarla</h3>
                <p className="subtle mt-1">{ticket.verification}</p>
            </details>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href={ticket.href} className="btn-secondary">{ticket.action}</Link>
                <Link href={'/expediente?ticket=' + ticket.id} className="btn-secondary"
                    onClick={() => {
                        try { sessionStorage.setItem('devforge-ticket:' + ticket.id, drafts[ticket.id] ?? ''); } catch { /* The ticket context remains available. */ }
                    }}>Llevar el ticket al expediente</Link>
            </div>
        </article>
    </section>;
}
