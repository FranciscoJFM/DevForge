import type { Metadata } from 'next';
import Link from 'next/link';
import DevForge3Hub from '@/components/DevForge3Hub';
import DevForge3Lab from '@/components/DevForge3Lab';

export const metadata: Metadata = {
    title: 'DevForge 3.0',
    description: 'Diez herramientas técnicas y diez capacidades profesionales para resolver problemas completos.',
};

export default function DevForge3Page() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro">
                <p className="hero-topic">DevForge 3.0</p>
                <h1 className="mt-3">Aprende, resuelve y verifica.</h1>
                <p>Diez herramientas técnicas y diez capacidades profesionales, organizadas alrededor de problemas reales y resultados verificables.</p>
            </header>
            <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/rescue-center" className="btn-primary">Abrir Rescue Center</Link>
                <Link href="/herramientas" className="btn-secondary">Ver herramientas existentes</Link>
            </div>
            <DevForge3Hub />
            <DevForge3Lab />
        </main>
    );
}
