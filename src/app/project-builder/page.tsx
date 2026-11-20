import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectAndPortfolio from '@/components/ProjectAndPortfolio';

export const metadata: Metadata = { title: 'Project Builder' };

export default function ProjectBuilderPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Project Builder</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Pasa de una idea a un borrador con requisitos, historias de usuario, estructura técnica y entregas. Descárgalo en Markdown y completa los criterios con tu equipo.</p>
        <ProjectAndPortfolio mode="project" />
        <Link className="btn-secondary mt-5" href="/expediente">Continuar al expediente del proyecto</Link>
    </main>;
}
