import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Wanchinchon Lang',
    description: 'Laboratorio de un lenguaje educativo de mundos y sucesos inspirado en una creación familiar.',
};

export default function WanchinchonPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro">
                <p className="hero-topic">Lenguajes y mundos imaginados</p>
                <h1 className="mt-3">Todo comenzó con una toalla llamada Wanchonchin.</h1>
                <p>Un niño imaginó palabras propias. Wanchinchon Lang convierte esa creatividad en mundos, seres y sucesos que se pueden ejecutar y explicar.</p>
            </header>
            <p className="subtle mt-5 max-w-3xl leading-7">
                La palabra <strong>wanchonchin</strong> significa toalla en la imaginación familiar que inspiró este proyecto. Las palabras técnicas de la sintaxis son propuestas desarrolladas por ustedes; no se atribuyen al niño como diseño técnico.
            </p>
            <section className="mt-8" aria-labelledby="wanchinchon-actions">
                <h2 id="wanchinchon-actions" className="section-title">¿Qué quieres hacer hoy?</h2>
                <div className="grid-cards mt-5">
                    <Link className="quick-tool" href="/wanchinchon/aprender"><span><strong>Aprender desde cero</strong><span>Ocho lecciones progresivas y ejecutables.</span></span></Link>
                    <Link className="quick-tool" href="/wanchinchon/playground"><span><strong>Crear mi programa</strong><span>Editor real, consola, estado y exportación.</span></span></Link>
                    <Link className="quick-tool" href="/wanchinchon/docs"><span><strong>Consultar documentación</strong><span>Tipos, operadores, funciones y restricciones.</span></span></Link>
                    <Link className="quick-tool" href="/wanchinchon/mundos"><span><strong>Explorar mundos</strong><span>Ejemplos de personajes y sucesos.</span></span></Link>
                </div>
            </section>
            <section className="panel mt-8 p-6">
                <p className="mini-tag">Primer programa</p>
                <h2 className="mt-3 text-2xl font-bold">Crea tu primer programa en 5 pasos</h2>
                <ol className="mt-4 grid gap-3 md:grid-cols-5">
                    {['Abre el playground', 'Escribe mundo', 'Añade dice', 'Ejecuta el programa', 'Explica la traza'].map((step, index) => <li key={step} className="rounded-lg border border-[color:var(--line)] p-3"><strong>{index + 1}.</strong> {step}</li>)}
                </ol>
                <Link className="btn-primary mt-5" href="/wanchinchon/aprender">Iniciar la primera lección</Link>
            </section>
        </main>
    );
}
