import type { Metadata } from 'next';
import Link from 'next/link';
import StackToolbox from '@/components/StackToolbox';

export const metadata: Metadata = {
    title: 'Herramientas para desarrolladores',
    description: 'Prepara integraciones, escribe código, documenta entregas y revisa cambios.',
};

const labs = [
    ['Document Studio', 'Word, PDF, Excel y Markdown', '/documentos'],
    ['Expediente de proyecto', 'Exporta decisiones, pruebas y capturas', '/expediente'],
    ['Cliente HTTP', 'Peticiones reales desde el navegador', '/cliente-http'],
    ['Extensiones para tu IDE', 'Apex, Android, web y APIs', '/ide'],
    ['Integration Lab', 'REST, SOAP y CRUD simulado', '/integration-lab'],
    ['Playground', 'Editor y retos JavaScript', '/playground'],
    ['API Studio', 'Clientes y contratos de integración', '/api-studio'],
    ['Generadores de código', 'Clases, formularios y clientes', '/ejemplos'],
    ['Debug Lab', 'Diagnóstico de errores', '/debug'],
    ['Revisión de código', 'Reglas, Clean Code y SOLID', '/revision-codigo'],
    ['Git y repositorios', 'Comandos y revisión de cambios', '/git'],
    ['Project Builder', 'Plan técnico y entregas', '/project-builder'],
];

export default function ToolsPage() {
    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Herramientas para desarrolladores</h1>
            <p>Prepara consultas, prueba tu código y genera documentación para el stack que usas.</p>
        </header>
        <nav aria-label="Secciones de herramientas" className="jump-nav">
            <a href="#integraciones">Integraciones</a>
            <a href="#texto">JSON y texto</a>
            <a href="#documentacion">Documentación</a>
            <a href="#plantillas">Plantillas</a>
        </nav>
        <section className="mt-8" aria-labelledby="tool-labs">
            <h2 id="tool-labs" className="section-title mb-4">Laboratorios y guías</h2>
            <div className="quick-tools">
                {labs.map(([name, detail, href]) => <Link href={href} key={href} className="quick-tool">
                    <span><strong>{name}</strong><span>{detail}</span></span>
                </Link>)}
            </div>
        </section>
        <StackToolbox />
    </main>;
}
