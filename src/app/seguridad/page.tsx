import type { Metadata } from 'next';
import Link from 'next/link';
import DependencyReview from '@/components/DependencyReview';

export const metadata: Metadata = { title: 'Seguridad aplicada' };

const topics = [
    ['Validación de entradas', 'Valida tipos, formatos y límites de longitud en el servidor.', 'Express · Django · Laravel'],
    ['Consultas SQL', 'Envía los valores como parámetros de la consulta. En PHP puedes usar consultas preparadas con PDO.', 'PHP · Python · Java'],
    ['Contenido dinámico', 'Usa el escape de tu motor de plantillas y revisa los lugares donde insertas HTML directamente.', 'React · Vue · Django'],
    ['Dependencias', 'Revisa avisos de seguridad y usa el archivo de bloqueo para reproducir las instalaciones.', 'Node.js · PHP · Python'],
    ['Gestión de secretos', 'Mantén las credenciales fuera del código fuente y del contenido que recibe el navegador.', 'Next.js · Laravel · Spring Boot'],
    ['Sesiones', 'Configura las cookies de sesión con Secure, HttpOnly y un valor de SameSite acorde al flujo de navegación.', 'Express · Django · Spring Boot'],
];

export default function SecurityPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black">Seguridad aplicada</h1>
            <p className="subtle mt-5 max-w-3xl leading-7">
                Puntos de revisión para aplicaciones web, desde la validación de una API hasta el manejo de sesiones y secretos.
            </p>
            <section className="mt-10" aria-labelledby="security-topics">
                <h2 id="security-topics" className="section-title mb-6">Qué revisar en tu aplicación</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {topics.map(([title, description, examples]) => (
                        <article key={title} className="panel p-6">
                            <h3 className="text-xl font-bold">{title}</h3>
                            <p className="subtle mt-3 leading-7">{description}</p>
                            <p className="mt-4 text-sm text-[color:var(--accent)]">{examples}</p>
                        </article>
                    ))}
                </div>
            </section>
            <DependencyReview />
            <Link href="/revision-codigo" className="btn-secondary mr-3 mt-8">Revisar un fragmento de código</Link>
            <Link href="/ia-responsable" className="btn-primary mr-3 mt-8">IA responsable en el IDE</Link>
            <Link href="/academia" className="btn-secondary mt-8">Explorar la Academia</Link>
        </main>
    );
}
