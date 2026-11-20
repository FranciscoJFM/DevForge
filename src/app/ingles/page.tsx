import type { Metadata } from 'next';
import Link from 'next/link';
import EnglishPractice from '@/components/EnglishPractice';

export const metadata: Metadata = {
    title: 'Inglés para desarrolladores',
    description: 'Practica inglés para entrevistas, CV, revisión de código y comunicación técnica.',
};

export default function EnglishPage() {
    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Inglés para desarrolladores</h1>
            <p>Explica lo que sabes hacer, responde preguntas técnicas y pide claridad en el trabajo. Practica con situaciones de Salesforce, Android y web.</p>
        </header>
        <nav aria-label="Secciones de inglés" className="jump-nav">
            <a href="#ruta">Ruta de estudio</a><a href="#practica">Ejercicios</a><a href="#postulacion">CV y correo</a>
        </nav>
        <section id="ruta" className="mt-8 scroll-mt-24" aria-labelledby="english-path">
            <h2 id="english-path" className="section-title">Ruta de estudio</h2>
            <ol className="grid-cards mb-8 mt-4">
                <li className="panel p-5"><h3 className="text-lg font-bold">1. Lee y resume</h3><p className="subtle mt-2">Lee una sección de un README. Escribe tres líneas: qué hace, cómo se ejecuta y qué condición puede fallar.</p></li>
                <li className="panel p-5"><h3 className="text-lg font-bold">2. Comunica un cambio</h3><p className="subtle mt-2">Describe un error o una mejora: qué observaste, qué hiciste y cómo lo comprobaste. Usa frases que dirías en una revisión.</p></li>
                <li className="panel p-5"><h3 className="text-lg font-bold">3. Simula una entrevista</h3><p className="subtle mt-2">Presenta un proyecto en un minuto. Después responde una pregunta de seguimiento sin memorizar el texto.</p></li>
            </ol>
        </section>
        <EnglishPractice />
        <section id="postulacion" className="panel mt-8 scroll-mt-24 p-5 md:p-7">
            <h2 className="section-title">CV y correo en inglés</h2>
            <p className="subtle mt-3">En el CV, empieza con un verbo de acción y explica qué entregaste. En el correo, nombra la vacante, conecta una habilidad con el puesto y menciona el archivo adjunto.</p>
            <p className="mt-4 font-semibold">Logro de ejemplo</p>
            <p className="mt-2" lang="en">Documented REST integration flows and wrote regression tests so the team could reproduce errors before release.</p>
            <p className="mt-4 font-semibold">Correo de postulación de ejemplo</p>
            <p className="mt-2 whitespace-pre-wrap" lang="en">{'Subject: Application for Salesforce Developer | Alex Rivera\n\nHi Hiring Team,\nI’m applying for the Salesforce Developer role. I have experience documenting integrations and preparing test cases for REST APIs. I’ve attached my resume and would be happy to discuss the role.\n\nThank you,\nAlex Rivera'}</p>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/herramientas#plantillas" className="btn-primary">Copiar plantillas en inglés</Link>
                <Link href="/entrevistas" className="btn-secondary">Practicar entrevistas técnicas</Link>
            </div>
        </section>
    </main>;
}
