import type { Metadata } from 'next';
import Link from 'next/link';
import CodePlayground from '@/components/CodePlayground';

export const metadata: Metadata = { title: 'Playground y retos JavaScript' };

export default function PlaygroundPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Playground y retos JavaScript</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Escribe código, ejecútalo y revisa el resultado. Puedes practicar con pruebas automáticas o empezar en el editor libre. La ejecución usa un proceso aislado del navegador con un límite de tiempo.</p>
        <CodePlayground />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/revision-codigo" className="btn-secondary">Revisar un fragmento</Link>
            <Link href="/ejemplos" className="btn-secondary">Ver ejemplos de otros lenguajes</Link>
            <Link href="/academia" className="btn-secondary">Ver rutas de estudio</Link>
        </div>
    </main>;
}
