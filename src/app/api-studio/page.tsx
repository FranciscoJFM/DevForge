import type { Metadata } from 'next';
import Link from 'next/link';
import ApiRequestBuilder from '@/components/ApiRequestBuilder';

export const metadata: Metadata = { title: 'API Studio' };

export default function ApiStudioPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black">API Studio</h1>
            <p className="subtle mt-4 max-w-3xl leading-7">Diseña solicitudes REST y SOAP 1.1 y genera ejemplos de cURL, fetch y Markdown. La herramienta prepara texto en el navegador. Usa datos de ejemplo y reserva los secretos para tu entorno de ejecución.</p>
            <Link href="/integration-lab" className="btn-primary mt-5">Simular un CRUD o una llamada SOAP</Link>
            <Link href="/cliente-http" className="btn-secondary ml-2 mt-5">Enviar una petición real</Link>
            <ApiRequestBuilder />
            <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ejemplos" className="btn-secondary">Ver clientes para Salesforce, Android y web</Link>
                <Link href="/debug#soap" className="btn-secondary">Diagnosticar un error SOAP</Link>
            </div>
        </main>
    );
}
