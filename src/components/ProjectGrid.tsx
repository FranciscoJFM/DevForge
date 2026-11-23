import Link from 'next/link';

type ProjectStatus = 'En producción' | 'Proyecto público' | 'Demo técnica' | 'En desarrollo';

const statusStyles: Record<ProjectStatus, string> = {
    'En producción': 'status-production',
    'Proyecto público': 'status-public',
    'Demo técnica': 'status-demo',
    'En desarrollo': 'status-development',
};

const projects: {
    name: string;
    description: string;
    stack: string[];
    href: string;
    action: string;
    status: ProjectStatus;
    repository?: string;
    external?: boolean;
}[] = [
    {
        name: 'DevForge',
        description: 'Ecosistema de aprendizaje, herramientas, documentación y protección profesional para desarrolladores.',
        stack: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
        href: 'https://devforge-mu-kohl.vercel.app',
        action: 'Abrir DevForge',
        status: 'En producción',
        repository: 'https://github.com/FranciscoJFM/DevForge',
        external: true,
    },
    {
        name: 'Matt Evan',
        description: 'Sitio operativo para presentar servicios y migrar impresiones antiguas como servicios comerciales.',
        stack: ['Next.js', 'React'],
        href: 'https://matt-evan.vercel.app',
        action: 'Abrir proyecto',
        status: 'Proyecto público',
        repository: 'https://github.com/FranciscoJFM/matt-evan',
        external: true,
    },
    {
        name: 'Tacos Arias',
        description: 'Proyecto público con catálogo, horario y disponibilidad de platillos.',
        stack: ['Next.js', 'React'],
        href: 'https://tacos-arias.vercel.app',
        action: 'Abrir proyecto',
        status: 'Proyecto público',
        repository: 'https://github.com/FranciscoJFM/tacosArias',
        external: true,
    },
    {
        name: 'Escudo Antifraude',
        description: 'Demo técnica de API con CORS y lógica para detectar posibles patrones fraudulentos.',
        stack: ['API', 'JavaScript', 'CORS'],
        href: 'https://escudo-antifraude.vercel.app',
        action: 'Abrir demo',
        status: 'Demo técnica',
        repository: 'https://github.com/FranciscoJFM/escudo-antifraude',
        external: true,
    },
    {
        name: 'Onboarding WhatsApp Demo',
        description: 'Demostración del proceso de incorporación y propuesta inicial mediante WhatsApp.',
        stack: ['JavaScript', 'WhatsApp'],
        href: 'https://onboarding-whatsapp-demo.vercel.app',
        action: 'Abrir demo',
        status: 'Proyecto público',
        external: true,
    },
    {
        name: 'Empatía Job',
        description: 'Recursos de empleo y acompañamiento profesional. El despliegue público de producción todavía está por consolidarse.',
        stack: ['React', 'Next.js'],
        href: '/empleo',
        action: 'Ver integración en DevForge',
        status: 'En desarrollo',
        repository: 'https://github.com/FranciscoJFM/empatiaJob',
    },
    {
        name: 'Next.js Boilerplate',
        description: 'Plantilla base para iniciar nuevas aplicaciones Next.js y reutilizar configuraciones de desarrollo.',
        stack: ['Next.js', 'React'],
        href: 'https://nextjs-boilerplate-six-lovat-85.vercel.app',
        action: 'Abrir plantilla',
        status: 'Demo técnica',
        repository: 'https://github.com/FranciscoJFM/nextjs-boilerplate',
        external: true,
    },
];

export default function ProjectGrid() {
    return (
        <div className="grid-cards">
            {projects.map(project => (
                <article key={project.name} className="panel flex flex-col p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-xl font-bold">{project.name}</h3>
                        <span className={`project-status ${statusStyles[project.status]}`}>{project.status}</span>
                    </div>
                    <p className="subtle mt-3 flex-1 leading-7">{project.description}</p>
                    {project.stack.length > 0 && (
                        <ul aria-label="Tecnologías" className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map(technology => (
                                <li key={technology} className="mini-tag">{technology}</li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {project.external ? (
                            <a className="btn-primary text-sm" href={project.href} target="_blank" rel="noopener noreferrer">{project.action}</a>
                        ) : (
                            <Link className="btn-secondary text-sm" href={project.href}>{project.action}</Link>
                        )}
                        {project.repository && (
                            <a className="btn-secondary text-sm" href={project.repository} target="_blank" rel="noopener noreferrer">Ver repositorio</a>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}
