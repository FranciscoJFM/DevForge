import Link from 'next/link';

const projects: {
    name: string;
    description: string;
    stack: string[];
    href: string;
    action: string;
    repository?: string;
}[] = [
    {
        name: 'DevForge',
        description: 'Un sitio que reúne un catálogo de microapps y contenido para desarrolladores.',
        stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        href: '/apps',
        action: 'Explorar el catálogo',
    },
    {
        name: 'Herramientas para desarrolladores',
        description: 'Utilidades que procesan datos directamente en el navegador para tareas cotidianas de desarrollo.',
        stack: ['React', 'TypeScript'],
        href: '/herramientas',
        action: 'Probar herramientas',
    },
    {
        name: 'CotizaFácil',
        description: 'Una microapp para preparar cotizaciones y generar propuestas para clientes. Consulta la ficha del producto.',
        stack: [],
        href: '/apps/cotizafacil',
        action: 'Ver ficha',
    },
];

export default function ProjectGrid() {
    return (
        <div className="grid-cards">
            {projects.map(project => (
                <article key={project.name} className="panel flex flex-col p-6">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <p className="subtle mt-3 flex-1 leading-7">{project.description}</p>
                    {project.stack.length > 0 && (
                        <ul aria-label="Tecnologías" className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map(technology => (
                                <li key={technology} className="mini-tag">{technology}</li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link className="btn-secondary text-sm" href={project.href}>{project.action}</Link>
                        {project.repository && (
                            <a className="btn-secondary text-sm" href={project.repository}>Ver repositorio</a>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}
