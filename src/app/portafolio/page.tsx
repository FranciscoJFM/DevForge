import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectAndPortfolio from '@/components/ProjectAndPortfolio';

export const metadata: Metadata = { title: 'Portfolio DevForge' };

export default function PortfolioPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Portfolio DevForge</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Describe lo que hiciste y genera una página HTML y un CV en Markdown. El HTML se puede abrir como archivo o subir a un alojamiento estático.</p>
        <ProjectAndPortfolio mode="portfolio" />
        <Link className="btn-secondary mt-5" href="/expediente">Preparar evidencia de un proyecto</Link>
    </main>;
}
