import type { Metadata } from 'next';
import Link from 'next/link';
import InterviewLab from '@/components/InterviewLab';

export const metadata: Metadata = { title: 'Interview Lab' };

export default function InterviewsPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Interview Lab</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Practica con preguntas técnicas. Escribe tu respuesta, compárala con los criterios y explica qué probarías.</p>
        <InterviewLab />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/ingles#practica" className="btn-secondary">Practicar en inglés</Link>
            <Link href="/ejemplos" className="btn-secondary">Repasar con ejemplos</Link>
            <Link href="/empleo" className="btn-secondary">Recursos para postulaciones</Link>
        </div>
    </main>;
}
