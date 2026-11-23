import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WanchinchonWorkerPlayground from '@/components/WanchinchonWorkerPlayground';
import { findWanchinchonLesson, wanchinchonLessons } from '@/lib/wanchinchonLessons';

export function generateStaticParams() {
    return [
        ...wanchinchonLessons.map(lesson => ({ slug: lesson.slug })),
        { slug: 'variables' },
        { slug: 'condiciones' },
        { slug: 'ciclos' },
        { slug: 'eventos' },
        { slug: 'proyecto-final' },
    ];
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    return params.then(({ slug }) => {
        const lesson = findWanchinchonLesson(slug);
        return { title: lesson ? lesson.title : 'Lección Wanchinchon' } satisfies Metadata;
    });
}

export default async function WanchinchonLessonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const lesson = findWanchinchonLesson(slug);
    if (!lesson) notFound();
    return (
        <main className="containerx py-10 md:py-16">
            <Link className="text-link" href="/wanchinchon/aprender">← Todas las lecciones</Link>
            <header className="page-intro mt-5">
                <p className="mini-tag">Lección {lesson.number}</p>
                <h1 className="mt-3">{lesson.title}</h1>
                <p>{lesson.summary}</p>
            </header>
            <section className="panel mt-6 p-5">
                <h2 className="text-xl font-bold">Qué aprenderás</h2>
                <ul className="subtle mt-3 list-disc space-y-2 pl-5">
                    {lesson.explanation.map(item => <li key={item}>{item}</li>)}
                </ul>
                <p className="mt-4"><strong>Resultado esperado:</strong> {lesson.expected}</p>
            </section>
            <WanchinchonWorkerPlayground initialCode={lesson.code} lessonName={lesson.slug} />
        </main>
    );
}
