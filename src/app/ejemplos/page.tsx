import type { Metadata } from 'next';
import Link from 'next/link';
import CodeLibrary from '@/components/CodeLibrary';

export const metadata: Metadata = { title: 'Ejemplos y generadores de código' };

export default function ExamplesPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black">Ejemplos y generadores de código</h1>
            <p className="subtle mt-4 max-w-3xl leading-7">Compara cómo cambia un constructor, un formulario o una llamada a un servicio. Elige un ejemplo, revisa sus requisitos y copia o descarga el fragmento para adaptarlo.</p>
            <CodeLibrary />
            <div className="mt-6 flex flex-wrap gap-3">
                <Link className="btn-primary" href="/integration-lab">Probar operaciones y respuestas</Link>
                <Link className="btn-secondary" href="/api-studio">Preparar una solicitud</Link>
                <Link className="btn-secondary" href="/herramientas#documentacion">Documentar la integración</Link>
                <a className="btn-secondary" href="https://developer.salesforce.com/docs/platform/lwc/guide/data-api-calls-apex.html">Callouts de Apex</a>
                <a className="btn-secondary" href="https://developer.salesforce.com/docs/platform/lwc/guide/data-edit-record">Formularios de Lightning</a>
                <a className="btn-secondary" href="https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-annotation-invocablemethod.html">Acciones invocables de Apex</a>
                <a className="btn-secondary" href="https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work">Trabajos con WorkManager</a>
            </div>
        </main>
    );
}
