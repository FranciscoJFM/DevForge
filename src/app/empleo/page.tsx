import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Empatía Jobs | Empleo y trato digno',
    description: 'Recursos para buscar empleo, revisar ofertas y pedir apoyo ante problemas laborales.',
};

const topics = [
    {
        title: 'Busca trabajo con un plan',
        tips: [
            'Elige un tipo de puesto y adapta el encabezado de tu CV a ese objetivo. Describe resultados que puedas explicar en una entrevista.',
            'Registra cada postulación con fecha, enlace, estado y siguiente paso. Guarda las versiones de CV que enviaste.',
            'Verifica a la empresa por un canal oficial antes de compartir documentos. Si te piden pagar por continuar o enviar datos bancarios durante la selección, pausa y verifica.',
        ],
    },
    {
        title: 'Aclara las condiciones antes de aceptar',
        tips: [
            'Pide por escrito el rango salarial, si es bruto o neto, el horario, la modalidad, el tipo de contrato y las prestaciones.',
            'Pregunta cómo se organizan y compensan las guardias, las horas extra y los cambios de horario.',
            'Si te piden una prueba técnica, acuerda la duración, el alcance y cómo se usará el resultado antes de empezar.',
        ],
    },
    {
        title: 'Documenta lo ocurrido y pide apoyo',
        tips: [
            'Anota fechas, hechos observables, acuerdos y respuestas. Conserva documentos a los que tengas acceso autorizado y protege los datos de otras personas.',
            'Si es seguro hacerlo, describe el hecho, explica su impacto y pide un cambio concreto con fecha de seguimiento.',
            'Si temes represalias o el canal interno no es seguro, busca apoyo por una vía que te dé confianza, como un sindicato o asesoría laboral. Antes de publicar un caso, revisa qué detalles podrían identificarte a ti o a terceros.',
        ],
    },
];

export default function EmploymentPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black md:text-5xl">Empatía Jobs</h1>
            <p className="subtle mt-5 max-w-3xl text-lg leading-8">
                Herramientas para buscar empleo, pedir condiciones claras y alzar la voz ante un trato injusto.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/trabajo-sostenible" className="btn-secondary">Ver el kit de trabajo sostenible</Link>
                <Link href="/herramientas#plantillas" className="btn-primary">Usar plantillas laborales</Link>
                <a href="https://www.linkedin.com/in/empat%C3%ADa-jobs-032174408/" className="btn-secondary">Empatía Jobs en LinkedIn</a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/guia-empleo" className="btn-primary">CV, postulaciones e ingresos</Link>
                <Link href="/foro" className="btn-secondary">Foro moderado</Link>
                <Link href="/analizar-vacante" className="btn-secondary">Revisar una vacante</Link>
                <Link href="/ingles" className="btn-secondary">Inglés para entrevistas y CV</Link>
                <Link href="/entrevistas" className="btn-secondary">Practicar una entrevista</Link>
                <Link href="/portafolio" className="btn-secondary">Crear portafolio y CV</Link>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
                {topics.map(({ title, tips }) => (
                    <section key={title} className="panel p-6">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <ul className="subtle mt-4 list-disc space-y-3 pl-5 leading-7">
                            {tips.map(tip => <li key={tip}>{tip}</li>)}
                        </ul>
                    </section>
                ))}
            </div>
            <section className="mt-10" aria-labelledby="unrealistic-vacancies">
                <h2 id="unrealistic-vacancies" className="section-title">Cuando una vacante pide de todo</h2>
                <p className="subtle mt-3 max-w-3xl leading-7">
                    Buscar trabajo durante meses, recibir pocas respuestas y ver listas interminables de requisitos desgasta. Una vacante describe lo que una empresa pide en ese momento. Tu experiencia también cuenta cuando puedes mostrar cómo resolviste problemas parecidos.
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <article className="panel p-6">
                        <h3 className="text-xl font-bold">Si estás postulando</h3>
                        <ul className="subtle mt-4 list-disc space-y-3 pl-5 leading-7">
                            <li>Ubica las tareas centrales. Si la vacante pide React y además enumera Android, iOS y Salesforce, pregunta cuáles usarías cada semana y cuáles se pueden aprender en el puesto.</li>
                            <li>Si puedes demostrar experiencia en las tareas principales, postúlate aunque te falten herramientas deseables. Da un ejemplo concreto de cómo aprendiste una tecnología similar.</li>
                            <li>Antes de invertir horas en una prueba, pide el rango salarial, las etapas y el tiempo esperado. Guarda tiempo para otras postulaciones y para descansar.</li>
                        </ul>
                    </article>
                    <article className="panel p-6">
                        <h3 className="text-xl font-bold">Si estás contratando</h3>
                        <ul className="subtle mt-4 list-disc space-y-3 pl-5 leading-7">
                            <li>Escribe qué hará la persona en sus primeros meses y separa los requisitos esenciales de lo que puede aprender con apoyo del equipo.</li>
                            <li>Publica el rango salarial, las etapas de selección y el tiempo de la prueba. Evalúa el trabajo con criterios que puedas compartir desde el principio.</li>
                            <li>Cierra el proceso con una respuesta. En entrevistas y conversaciones en LinkedIn, comenta el trabajo con respeto y evita burlas sobre la trayectoria o la experiencia de quien busca empleo.</li>
                        </ul>
                    </article>
                </div>
            </section>
            <section className="panel mt-8 p-6">
                <h2 className="text-xl font-bold">Dónde pedir orientación en México</h2>
                <p className="subtle mt-3 max-w-3xl leading-7">
                    PROFEDET ofrece orientación laboral gratuita y puede ayudarte a identificar qué vía corresponde a tu situación.
                </p>
                <a href="https://www.gob.mx/profedet/es/articulos/conoce-nuestros-servicios?idiom=es" className="btn-secondary mt-5">Consultar servicios de PROFEDET</a>
            </section>
        </main>
    );
}