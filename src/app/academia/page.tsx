import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/data';
import { studyTracks } from '@/lib/studyTracks';

export const metadata: Metadata = { title: 'Academia' };

export default function Academy() {
    return (
        <main className="containerx py-16">
            <header className="page-intro">
                <h1>Academia DevForge</h1>
                <p>Elige una tecnología, comprueba lo aprendido con ejercicios y termina un proyecto que puedas explicar en una entrevista.</p>
            </header>
            <Link href="/desarrollo" className="btn-primary mr-3 mt-6">Salesforce, Android y web</Link><Link href="/ia-responsable" className="btn-secondary mt-6">Leer la guía de IA responsable en el IDE</Link>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/retos" className="btn-primary">Resolver un ticket</Link>
                <Link href="/playground" className="btn-primary">Practicar con retos</Link>
                <Link href="/ingles" className="btn-secondary">Inglés para desarrolladores</Link>
                <Link href="/git" className="btn-secondary">Aprender Git</Link>
                <Link href="/ejemplos" className="btn-secondary">Generadores y ejemplos de código</Link>
                <Link href="/entrevistas" className="btn-secondary">Práctica de entrevistas técnicas</Link>
            </div>
            <section className="mt-10" aria-labelledby="technology-tracks">
                <h2 id="technology-tracks" className="section-title mb-6">Rutas de estudio por tecnología</h2>
                <div className="grid-cards">
                    {studyTracks.map(track => (
                        <article className="panel flex flex-col p-6" key={track.slug}>
                            <h3 className="text-xl font-bold">{track.name}</h3>
                            <p className="mt-2 text-sm text-[color:var(--accent)]">{track.stack}</p>
                            <p className="subtle mt-3 flex-1 leading-7">{track.project}</p>
                            <Link href={'/academia/' + track.slug} className="btn-secondary mt-4 self-start">Ver ruta de {track.name}</Link>
                        </article>
                    ))}
                </div>
            </section>
            <Link href="/videoblog" className="btn-secondary mt-6">Ver videoblog</Link>
            <section className="panel mt-8 p-6">
                <h2 className="section-title">Tutorial destacado</h2>
                <p className="subtle mt-3">Aprende a distinguir un error HTTP de un timeout o un JSON inválido con código y pruebas descargables.</p>
                <Link href="/academia/rest-confiable" className="btn-primary mt-4">Consumir una API REST de forma confiable</Link>
            </section>
            <section className="mt-10" aria-labelledby="planned-guides">
                <h2 id="planned-guides" className="section-title mb-6">Guías planificadas</h2>
                <div className="grid-cards">
                    {posts.map(post => (
                        <article className="panel scroll-mt-24 p-6" id={post.slug} key={post.slug}>
                            <span className="mini-tag">{post.category}</span>
                            <h3 className="mt-5 text-xl font-bold">{post.title}</h3>
                            <p className="subtle mt-3 text-sm">{post.excerpt}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}