"use client";

import { useActionState, useState } from 'react';
import { submitForumPost } from '@/app/foro/actions';
import { forumCategories } from '@/lib/forumCategories';

export default function ForumForm() {
    const [submission, setSubmission] = useState(0);
    return <ForumSubmission key={submission} onRestart={() => setSubmission(current => current + 1)} />;
}

function ForumSubmission({ onRestart }: { onRestart: () => void }) {
    const [state, action, pending] = useActionState(submitForumPost, { message: '', success: false });
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState<string>(forumCategories[0]);
    if (state.success) return <div className="panel mt-8 p-6">
        <p role="status">{state.message}</p>
        <button className="btn-secondary mt-4" type="button" onClick={onRestart}>Escribir otro envío</button>
    </div>;

    return <section className="panel mt-8 p-6">
        <h2 className="text-xl font-bold">Enviar un relato o una pregunta</h2>
        <p className="subtle mt-3">El equipo de moderación verá lo que escribas. Describe hechos, su impacto y qué apoyo buscas. Omite nombres de personas y empresas, ubicaciones precisas, enlaces, datos de clientes y detalles que puedan identificar a alguien.</p>
        <p className="subtle mt-2">Para recomendar un repositorio público, indica su nombre en formato organización/repositorio y para qué lo usaste.</p>
        <form action={action} className="mt-5 space-y-4">
            <label className="block">Categoría<select className="field mt-2" name="category" value={category} onChange={event => setCategory(event.target.value)}>{forumCategories.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="block">Título<input className="field mt-2" name="title" required minLength={5} maxLength={100} value={title} onChange={event => setTitle(event.target.value)} /></label>
            <label className="block">Relato o pregunta<textarea className="field mt-2 min-h-36" name="body" required minLength={25} maxLength={2000} value={body} onChange={event => setBody(event.target.value)} /></label>
            <label className="flex items-start gap-3"><input type="checkbox" name="review" className="mt-1" required /> Revisé que el texto no identifique a otras personas ni incluya datos sensibles.</label>
            <button className="btn-primary disabled:opacity-50" disabled={pending} type="submit">{pending ? 'Enviando…' : 'Enviar para revisión'}</button>
            {!state.success && state.message && <p role="alert" className="text-red-200">{state.message}</p>}
        </form>
    </section>;
}
