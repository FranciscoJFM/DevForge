"use client";

import { FormEvent, useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

type ForumPost = { id: string; title: string; content: string; category: string };

export default function FirebaseForum() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [category, setCategory] = useState('Desarrollo');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!firestore) return;
        getDocs(query(collection(firestore, 'forumPosts'), where('status', '==', 'published')))
            .then(snapshot => setPosts(snapshot.docs.map(document => ({
                id: document.id,
                title: String(document.data().title ?? ''),
                content: String(document.data().content ?? ''),
                category: String(document.data().category ?? ''),
            }))))
            .catch(() => setPosts([]));
    }, []);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setError('');
        setMessage('');
        if (!firestore || !user) {
            setError('Inicia sesión para enviar una publicación.');
            return;
        }
        if (title.trim().length < 5 || content.trim().length < 25) {
            setError('Completa el título y el relato con la longitud requerida.');
            return;
        }
        try {
            await addDoc(collection(firestore, 'forumPosts'), {
                authorUid: user.uid,
                title: title.trim(),
                content: content.trim(),
                category,
                status: 'pending',
                createdAt: serverTimestamp(),
            });
            setTitle('');
            setContent('');
            setMessage('Enviado para revisión. No aparecerá hasta que una moderación administrativa lo apruebe.');
        } catch {
            setError('No fue posible enviar la publicación.');
        }
    }

    return (
        <div>
            {posts.length > 0 && <section className="mt-8">
                <h2 className="section-title">Publicaciones aprobadas</h2>
                <div className="mt-4 space-y-4">
                    {posts.map(post => <article key={post.id} className="panel p-6">
                        <p className="text-sm text-[color:var(--accent)]">{post.category}</p>
                        <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
                        <p className="subtle mt-3 whitespace-pre-wrap">{post.content}</p>
                    </article>)}
                </div>
            </section>}
            <section className="panel mt-8 p-6">
                <h2 className="text-xl font-bold">Enviar una publicación</h2>
                {!user
                    ? <p className="subtle mt-3">Debes iniciar sesión para enviar una propuesta al foro.</p>
                    : <form className="mt-5 space-y-4" onSubmit={submit}>
                        <label className="block">Categoría<select className="field mt-2" value={category} onChange={event => setCategory(event.target.value)}>{['Desarrollo', 'Empleo', 'Trabajo sostenible', 'Recursos'].map(item => <option key={item}>{item}</option>)}</select></label>
                        <label className="block">Título<input className="field mt-2" required minLength={5} maxLength={100} value={title} onChange={event => setTitle(event.target.value)} /></label>
                        <label className="block">Relato o pregunta<textarea className="field mt-2 min-h-36" required minLength={25} maxLength={2000} value={content} onChange={event => setContent(event.target.value)} /></label>
                        {message && <p role="status" className="text-[color:var(--success)]">{message}</p>}
                        {error && <p role="alert" className="text-[color:var(--danger)]">{error}</p>}
                        <button className="btn-primary" type="submit">Enviar para revisión</button>
                    </form>}
            </section>
        </div>
    );
}
