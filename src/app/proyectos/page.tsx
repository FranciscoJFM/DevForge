import type { Metadata } from 'next';
import ProjectGrid from '@/components/ProjectGrid';

export const metadata: Metadata = {
    title: 'Proyectos',
    description: 'Proyectos de DevForge, herramientas para desarrolladores y microapps para negocios.',
};

export default function ProjectsPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black">Proyectos de DevForge</h1>
            <p className="subtle mb-10 mt-4 max-w-2xl leading-7">
                Explora qué problema aborda cada proyecto y abre las herramientas o fichas disponibles.
            </p>
            <section aria-labelledby="project-list">
                <h2 id="project-list" className="sr-only">Catálogo de proyectos</h2>
                <ProjectGrid />
            </section>
        </main>
    );
}
