import type { Metadata } from 'next';
import Link from 'next/link';
import IntegrationLab from '@/components/IntegrationLab';

export const metadata: Metadata = {
    title: 'Integration Lab | REST y SOAP',
    description: 'Practica CRUD, interpreta respuestas HTTP y SOAP Fault, y descarga un contrato OpenAPI.',
};

export default function IntegrationLabPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black md:text-5xl">Integration Lab</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Prueba GET, POST, PUT, PATCH y DELETE, suma dos números con SOAP o actualiza una solicitud ficticia en un flujo Salesforce ↔ Siebel. Las peticiones se simulan en el navegador. Los cambios duran mientras la página sigue abierta.</p>
        <div className="mt-5"><Link href="/cliente-http" className="btn-primary">Probar una API real</Link></div>
        <IntegrationLab />
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Prácticas y casos de error</h2>
            <ul className="subtle mt-3 list-disc space-y-2 pl-5">
                <li>Crea una publicación, toma el identificador del encabezado Location, léela, usa PATCH para cambiar solo el título y luego elimínala. Confirma que GET devuelve 404.</li>
                <li>En SOAP, cambia un entero por texto o modifica la URI del namespace. Compara el Fault con la respuesta exitosa.</li>
                <li>Consulta SR-100, actualiza su actividad con PATCH y revisa que GET conserve el cambio. Simula 401 y 429 para practicar la renovación de credenciales y el uso de Retry-After.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/api-studio" className="btn-secondary">Diseñar otra solicitud en API Studio</Link>
                <Link href="/debug" className="btn-secondary">Diagnosticar errores</Link>
            </div>
        </section>
    </main>;
}
