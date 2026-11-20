import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { studyTracks } from '@/lib/studyTracks';
import { studyPrograms } from '@/lib/studyPrograms';

type RouteProps = { params: Promise<{ ruta: string }> };

export function generateStaticParams() {
    return studyTracks.map(track => ({ ruta: track.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { ruta } = await params;
    const track = studyTracks.find(item => item.slug === ruta);
    return { title: track ? 'Ruta de estudio de ' + track.name : 'Ruta de estudio', description: track?.project };
}

export default async function StudyTrackPage({ params }: RouteProps) {
    const { ruta } = await params;
    const track = studyTracks.find(item => item.slug === ruta);
    if (!track) notFound();
    const program = studyPrograms[track.slug];

    return <main className="containerx py-16">
        <Link href="/academia" className="btn-secondary">Todas las rutas</Link>
        <h1 className="mt-6 text-4xl font-black md:text-5xl">Ruta de estudio de {track.name}</h1>
        <p className="mt-3 text-[color:var(--accent)]">{track.stack}</p>
        <section className="mt-8" aria-labelledby="study-steps">
            <h2 id="study-steps" className="section-title">Qué estudiar y qué practicar</h2>
            <ol className="mt-5 space-y-4">
                {track.steps.map((step, index) => <li key={step.title} className="panel p-6">
                    <h3 className="text-xl font-bold">{index + 1}. {step.title}</h3>
                    <p className="subtle mt-3 leading-7"><strong className="text-[color:var(--text)]">Ejercicio.</strong> {step.exercise}</p>
                    <p className="subtle mt-2 leading-7"><strong className="text-[color:var(--text)]">Cómo comprobarlo.</strong> {step.check}</p>
                </li>)}
            </ol>
        </section>
        {program && <section className="panel mt-7 p-6" aria-labelledby="study-program">
            <h2 id="study-program" className="section-title">Programa por módulos</h2>
            <p className="subtle mt-3">Completa los módulos en orden. Guarda una prueba o captura por cada entrega que quieras incluir en tu expediente.</p>
            <ol className="mt-5 space-y-4">
                {program.map(([title, goal, evidence], index) => <li key={title} className="rounded-xl border border-[color:var(--line)] p-4">
                    <h3 className="font-bold">{index + 1}. {title}</h3>
                    <p className="subtle mt-1">{goal}</p>
                    <p className="mt-2"><strong>Práctica verificable.</strong> {evidence}</p>
                </li>)}
            </ol>
            <p className="subtle mt-5">Evaluación final. Demuestra el flujo principal, reproduce un fallo y explica una decisión que tomarías de otra manera en producción.</p>
        </section>}
        <section className="panel mt-7 p-6" aria-labelledby="project-milestones">
            <h2 id="project-milestones" className="section-title">Proyecto por entregas</h2>
            <p className="subtle mt-3">{track.project}</p>
            <ol className="mt-5 list-decimal space-y-4 pl-5">
                <li><strong>Requisitos.</strong> Describe quién lo usará, una tarea que necesita completar y dos criterios de aceptación. <Link className="text-link" href="/project-builder">Preparar el plan</Link></li>
                <li><strong>Implementación.</strong> Construye primero el flujo principal con datos ficticios. Usa como punto de partida el ejercicio de {track.steps[1].title.toLowerCase()}.</li>
                <li><strong>Pruebas.</strong> Comprueba el flujo exitoso y un caso de fallo. Registra el resultado y cómo reproducirlo.</li>
                <li><strong>Documentación.</strong> Añade un README con los pasos de ejecución, las decisiones y una limitación conocida. <Link className="text-link" href="/herramientas#documentacion">Generar documentación</Link></li>
                <li><strong>Evidencia para el portafolio.</strong> Reúne el alcance, una captura y las pruebas. Explica qué aprendiste y qué cambiarías.</li>
            </ol>
            <Link className="btn-primary mt-5" href={'/expediente?ruta=' + track.slug}>Crear expediente de este proyecto</Link>
        </section>
        <div className="mt-7">
            <section className="panel p-6">
                <h2 className="text-xl font-bold">{track.resource.kind}</h2>
                <p className="subtle mt-3">{track.resource.note}</p>
                <a href={track.resource.href} className="btn-secondary mt-4">{track.resource.title}</a>
            </section>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/ejemplos" className="btn-secondary">Ver ejemplos de código</Link>
            <Link href="/portafolio" className="btn-secondary">Presentar el proyecto en tu portafolio</Link>
        </div>
    </main>;
}
