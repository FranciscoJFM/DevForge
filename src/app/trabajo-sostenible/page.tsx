import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Trabajo sostenible para desarrolladores' };

export default function SustainableWorkPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black md:text-5xl">Trabajo sostenible para desarrolladores</h1>
            <p className="subtle mt-5 max-w-3xl text-lg leading-8">
                Recursos para negociar el alcance, pedir apoyo ante un trato injusto y proteger el tiempo de descanso y de familia.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
                <section className="panel p-6">
                    <h2 className="text-xl font-bold">Negocia qué cabe en la fecha</h2>
                    <p className="subtle mt-3 leading-7">Explica qué está en curso, qué trabajo agrega la petición y qué opciones tiene el equipo. Pide que la persona responsable elija una prioridad y deja por escrito el acuerdo.</p>
                    <blockquote className="mt-4 border-l-2 border-[color:var(--accent)] pl-4">Si la nueva integración entra para el viernes, propongo mover el reporte al próximo ciclo. ¿Cuál priorizamos?</blockquote>
                </section>
                <section className="panel p-6">
                    <h2 className="text-xl font-bold">Actúa ante un trato abusivo</h2>
                    <p className="subtle mt-3 leading-7">Si hay humillaciones, amenazas o represalias, anota fechas, hechos observables y respuestas. Busca apoyo de alguien de confianza y elige un canal seguro. Si la persona involucrada controla el canal habitual, consulta otra vía, como un representante laboral o asesoría externa.</p>
                    <Link href="/empleo" className="btn-secondary mt-5">Ver recursos de Empatía Jobs</Link>
                </section>
                <section className="panel p-6">
                    <h2 className="text-xl font-bold">Protege el descanso y la vida fuera del trabajo</h2>
                    <p className="subtle mt-3 leading-7">Acuerden horarios de contacto, quién cubre las guardias, qué se considera urgente y cuándo se retoma el trabajo. Si la carga afecta de forma persistente tu sueño o tu vida familiar, habla con alguien de confianza y pide revisar la carga.</p>
                </section>
                <section className="panel p-6">
                    <h2 className="text-xl font-bold">Si lideras, haz visible el costo de cada cambio</h2>
                    <p className="subtle mt-3 leading-7">Si eres PM, product owner, líder técnico o director, explicita qué se pospone cuando entra una urgencia. Da retroalimentación sobre hechos y acuerdos en un espacio adecuado. Revisa con el equipo qué decisiones evitarían repetir una guardia o una entrega fuera de horario.</p>
                </section>
            </div>
            <section className="panel mt-6 p-6">
                <h2 className="text-xl font-bold">Qué decir en el momento y cómo dar seguimiento</h2>
                <blockquote className="mt-4 border-l-2 border-[color:var(--accent)] pl-4">Puedo revisar el error y corregirlo. Pido que hablemos del problema sin descalificaciones. Si hace falta, retomemos la conversación con alguien del equipo presente.</blockquote>
                <p className="subtle mt-4 leading-7">Si hablar en el momento te expone, anota lo ocurrido y busca un canal seguro. Al pedir apoyo, describe el hecho, su impacto y el cambio que necesitas. Acuerda quién dará seguimiento y cuándo. Si eres testigo, pregunta en privado cómo quiere que le apoyes antes de compartir su caso.</p>
            </section>
            <Link href="/foro" className="btn-secondary mr-3 mt-8">Compartir una experiencia en el foro</Link>
            <Link href="/herramientas#plantillas" className="btn-primary mt-8">Copiar plantillas para acordar límites</Link>
        </main>
    );
}