import type { Metadata } from 'next';
import Link from 'next/link';
import ForumForm from '@/components/ForumForm';
import { publishedForumPosts } from '@/lib/forum';

export const metadata: Metadata = { title: 'Foro moderado de Empatía Jobs' };
export const dynamic = 'force-dynamic';

export default async function ForumPage() {
    const posts = await publishedForumPosts();
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black md:text-5xl">Foro de Empatía Jobs</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Comparte una experiencia laboral, una duda de desarrollo, un consejo de carrera o una recomendación de recurso. El formulario no pide nombre, correo ni cuenta. Cada envío pasa por revisión humana antes de publicarse.</p>
        <p className="subtle mt-3 leading-7">Para recibir orientación sobre una denuncia formal en México, consulta a PROFEDET.</p>
        <div className="mt-5 flex flex-wrap gap-3">
            <a className="btn-secondary" href="https://www.gob.mx/profedet/es/articulos/conoce-nuestros-servicios">Consultar a PROFEDET</a>
            <Link className="btn-secondary" href="/trabajo-sostenible">Recursos para pedir apoyo</Link>
        </div>
        <ForumForm />
        <section className="mt-10">
            <h2 className="section-title">Publicaciones aprobadas</h2>
            {posts.length === 0 ? <p className="subtle mt-4">Todavía no hay publicaciones aprobadas.</p> : <div className="mt-4 space-y-4">
                {posts.map(post => <article className="panel p-6" key={post.id}>
                    <p className="text-sm text-[color:var(--accent)]">{post.category}</p>
                    <h3 className="mt-2 break-words text-xl font-bold">{post.title}</h3>
                    <p className="subtle mt-3 whitespace-pre-wrap break-words">{post.body}</p>
                </article>)}
            </div>}
        </section>
    </main>;
}
