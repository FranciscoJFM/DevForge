import type { Metadata } from 'next';
import DocumentStudio from '@/components/DocumentStudio';
import { studioTemplates, type TemplateId } from '@/lib/documentStudio';

export const metadata: Metadata = {
    title: 'Document Studio',
    description: 'Crea documentos de proyecto con vista previa y exportación a Word, PDF, Excel o Markdown.',
};

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ plantilla?: string; metodo?: string; plataforma?: string }> }) {
    const { plantilla, metodo, plataforma } = await searchParams;
    const template = typeof plantilla === 'string' && Object.hasOwn(studioTemplates, plantilla) ? plantilla as TemplateId : 'memoria';
    const method = typeof metodo === 'string' && ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo) ? metodo : undefined;

    return <main className="containerx studio-page py-12 md:py-16">
        <header className="page-intro studio-controls">
            <h1>Document Studio</h1>
            <p>Completa una plantilla, revisa el resultado y prepara el archivo de entrega. Los campos vacíos quedan marcados como pendientes de confirmar.</p>
        </header>
        <DocumentStudio key={[template, method, plataforma].join(':')} setup={{ template, method, salesforce: plataforma === 'salesforce' && template === 'liberacion' }} />
    </main>;
}
