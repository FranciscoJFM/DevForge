import type { Metadata } from 'next';
import Link from 'next/link';
import StackRoutes from '@/components/StackRoutes';

export const metadata: Metadata = {
    title: 'Salesforce, Android y web',
    description: 'Rutas de desarrollo y herramientas para integrar Salesforce, Android y aplicaciones web.',
};

const areas = [
    {
        id: 'salesforce',
        name: 'Salesforce',
        summary: 'Desarrolla lógica en Apex, interfaces con Lightning y servicios que puedan consumir otras aplicaciones.',
        topics: [
            ['Wrappers para integraciones', 'Define un DTO con los campos del contrato, serializa a JSON y valida la entrada antes de convertirla en datos de la org.'],
            ['Flows y jobs', 'Usa acciones invocables cuando Flow necesite lógica en código. Para un callout en segundo plano, revisa Queueable y el seguimiento en Apex Jobs.'],
            ['Apex y pruebas', 'Practica triggers que procesen varios registros, separa la lógica de negocio y cubre los casos de error.'],
            ['Lightning Web Components', 'Construye una vista de cuentas con estado de carga, resultados vacíos y acciones accesibles.'],
            ['Datos y consultas', 'Practica SOQL con cuentas y contactos. Usa SOSL cuando necesites buscar texto en varios objetos.'],
            ['Integraciones REST y SOAP', 'Prepara una consulta SOQL para REST o un sobre XML según el WSDL. En Apex, usa Named Credentials para los callouts y respuestas simuladas en las pruebas.'],
            ['Automatización y despliegue', 'Combina Flow para procesos declarativos y Apex para lógica que requiera código. Prueba los cambios en un entorno separado antes de desplegar.'],
        ],
    },
    {
        id: 'android',
        name: 'Android',
        summary: 'Construye aplicaciones con Kotlin y Jetpack Compose que consuman servicios de forma predecible.',
        topics: [
            ['Trabajos en segundo plano', 'Usa WorkManager para trabajo diferible que deba sobrevivir al cierre de la pantalla. Define restricciones y evita trabajos duplicados.'],
            ['Interfaz y estado', 'Distingue carga, éxito, lista vacía y error. Conserva el estado de pantalla en un ViewModel.'],
            ['Networking y datos locales', 'Prueba respuestas lentas o sin conexión. Define cuándo mostrar datos guardados y cuándo pedir una actualización.'],
        ],
    },
    {
        id: 'web',
        name: 'Web',
        summary: 'Construye interfaces con React y TypeScript y conecta tus aplicaciones mediante APIs.',
        topics: [
            ['Interfaces y formularios', 'Valida entradas, ofrece mensajes junto al campo correspondiente y prueba la navegación con teclado.'],
            ['Integración con servicios', 'Maneja errores HTTP y deja las credenciales de servicios externos en el servidor. Prueba primero con datos ficticios.'],
        ],
    },
];

export default function DevelopmentPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black md:text-5xl">Salesforce, Android y web</h1>
            <p className="subtle mt-5 max-w-3xl text-lg leading-8">
                Pasa de una idea a una integración y reutiliza las mismas herramientas al trabajar con datos, APIs y aplicaciones.
            </p>
            <nav aria-label="Áreas de desarrollo" className="mt-6 flex flex-wrap gap-3">
                {areas.map(area => <a key={area.id} href={'#' + area.id} className="btn-secondary">{area.name}</a>)}
                <Link href="/herramientas#integraciones" className="btn-primary">Abrir herramientas</Link>
            </nav>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/ejemplos" className="btn-secondary">Formularios, constructores y clientes API</Link>
                <Link href="/project-builder" className="btn-secondary">Planear un proyecto</Link>
                <Link href="/integration-lab" className="btn-primary">Practicar REST, SOAP y CRUD</Link>
                <Link href="/api-studio" className="btn-secondary">Diseñar solicitudes REST y SOAP</Link>
            </div>
            {areas.map(area => (
                <section key={area.id} id={area.id} className="mt-12 scroll-mt-24" aria-labelledby={area.id + '-heading'}>
                    <h2 id={area.id + '-heading'} className="section-title">{area.name}</h2>
                    <p className="subtle mt-3 max-w-3xl leading-7">{area.summary}</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {area.topics.map(([title, detail]) => (
                            <article key={title} className="panel p-6">
                                <h3 className="text-lg font-bold">{title}</h3>
                                <p className="subtle mt-2 leading-7">{detail}</p>
                            </article>
                        ))}
                    </div>
                    {area.id === 'salesforce' && (
                        <div className="mt-4 flex flex-wrap items-center gap-3"><Link href="/documentos?plantilla=liberacion&plataforma=salesforce" className="btn-secondary">Preparar una entrega Salesforce</Link><a className="inline-block text-[color:var(--accent)]" href="https://developer.salesforce.com/docs/platform/api-rest/guide/resources-query">Documentación de consultas REST de Salesforce</a></div>
                    )}
                </section>
            ))}
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/proyectos" className="btn-secondary">Ver proyectos</Link><Link href="/trayectoria" className="btn-secondary">Conocer la trayectoria</Link></div>
            <StackRoutes />
            <section className="panel mt-12 p-6">
                <h2 className="text-xl font-bold">Proyecto para practicar las tres áreas</h2>
                <p className="subtle mt-3 max-w-3xl leading-7">
                    Crea un directorio de cuentas ficticias. Define la consulta SOQL, prepara un servicio intermedio que conserve los secretos del lado servidor y muestra los resultados en dos clientes, uno web y otro Android. Incluye estados de error y resultados vacíos.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/herramientas#integraciones" className="btn-primary">Preparar la consulta</Link>
                    <Link href="/herramientas#documentacion" className="btn-secondary">Documentar la integración</Link>
                    <Link href="/academia" className="btn-secondary">Ver proyectos de práctica</Link>
                </div>
            </section>
        </main>
    );
}