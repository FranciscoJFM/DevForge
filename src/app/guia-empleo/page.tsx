import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'CV, postulaciones e ingresos entre empleos' };

export default function JobGuidePage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black md:text-5xl">CV, postulaciones e ingresos entre empleos</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Prepara una postulación clara y prueba alternativas de ingreso compatibles con tu tiempo y tu búsqueda de trabajo.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
            <section className="panel p-6">
                <h2 className="text-xl font-bold">Escribe un CV que puedas defender</h2>
                <ol className="subtle mt-4 list-decimal space-y-3 pl-5">
                    <li>Encabeza con el puesto al que aspiras, tus datos de contacto profesionales y un enlace al portafolio si lo tienes.</li>
                    <li>Adapta el resumen a las tareas reales de la vacante. Incluye habilidades transferibles, como documentar flujos, depurar errores y probar integraciones.</li>
                    <li>Escribe cada logro con acción, contexto y resultado. Usa métricas que puedas explicar. Si no mediste el impacto, describe qué entregaste y quién lo usó.</li>
                    <li>Exporta un PDF con texto seleccionable y verifica que los enlaces abran. Usa un nombre de archivo claro, como Nombre_Apellido_CV.pdf.</li>
                </ol>
                <p className="mt-4 rounded-lg bg-[color:var(--well)] p-4">Ejemplo ficticio: Documenté el flujo de alta y preparé casos de prueba para que el equipo pudiera reproducir errores antes de la liberación.</p>
            </section>
            <section className="panel p-6">
                <h2 className="text-xl font-bold">Envía un correo breve y específico</h2>
                <p className="subtle mt-4">Usa el nombre de la vacante en el asunto. Explica en una frase por qué encaja tu experiencia y comprueba que adjuntaste el CV antes de enviar.</p>
                <blockquote className="mt-4 whitespace-pre-wrap rounded-lg bg-[color:var(--well)] p-4">{'Asunto: Postulación a Desarrollador Salesforce | Alex Rivera\n\nHola, equipo de selección:\n\nMe postulo a la vacante de Desarrollador Salesforce. He documentado integraciones y preparado casos de prueba para APIs, dos tareas que vi en la descripción. Adjunto mi CV y quedo disponible para conversar.\n\nGracias,\nAlex Rivera'}</blockquote>
            </section>
        </div>
        <section className="panel mt-6 p-6">
            <h2 className="text-xl font-bold">Organiza tu búsqueda</h2>
            <ul className="subtle mt-4 list-disc space-y-3 pl-5">
                <li>Define dos tipos de puesto. Para cada uno, guarda una versión del CV y un proyecto breve que puedas mostrar.</li>
                <li>Combina portales con contactos de confianza. Pide información sobre el equipo o el proceso con una pregunta concreta.</li>
                <li>Registra los envíos, las respuestas y la siguiente acción. Si una versión del CV recibe pocas respuestas, revisa los primeros párrafos y cómo muestras tu experiencia.</li>
            </ul>
        </section>
        <section className="panel mt-6 p-6">
            <h2 className="text-xl font-bold">Prueba ingresos que puedas evaluar en pequeño</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
                <article><h3 className="font-bold">Traslados o entregas</h3><p className="subtle mt-2">Si ya tienes vehículo y consideras Uber u otra plataforma, confirma requisitos locales y cobertura de seguro. Mide ingreso menos combustible, comisiones, mantenimiento y tiempo de espera.</p></article>
                <article><h3 className="font-bold">Ventas y venta de garaje</h3><p className="subtle mt-2">Empieza con artículos que ya tengas. Publica fotos propias y precios claros. Calcula cuánto queda después de empaque, envío o comisiones.</p></article>
                <article><h3 className="font-bold">Servicios pequeños</h3><p className="subtle mt-2">Ofrece un entregable acotado, como un manual, una plantilla o un formulario. Acuerda por escrito alcance, entrega, revisiones y condiciones de pago antes de comenzar.</p></article>
            </div>
            <p className="subtle mt-4">Para comparar opciones, registra ingreso neto por hora y reserva tiempo para postulaciones, descanso y familia.</p>
        </section>
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/herramientas#plantillas" className="btn-primary">Copiar plantillas de postulación</Link>
            <Link href="/ingles#postulacion" className="btn-secondary">Ver CV y correo en inglés</Link>
            <Link href="/portafolio" className="btn-secondary">Preparar CV y portafolio</Link>
            <Link href="/foro" className="btn-secondary">Abrir el foro</Link>
        </div>
    </main>;
}
