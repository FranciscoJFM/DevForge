import type { Metadata } from 'next';
import Link from 'next/link';
import ReviewChecklist from '@/components/ReviewChecklist';
import PromptBuilder from '@/components/PromptBuilder';
import AiVerificationArena from '@/components/AiVerificationArena';

export const metadata: Metadata = { title: 'IA responsable en el IDE' };

const steps = [
    {
        title: 'Antes de compartir contexto',
        description: 'Usa un ejemplo mínimo con datos ficticios. Revisa qué archivos puede leer la extensión y qué datos se envían al proveedor. Excluye credenciales, datos de clientes y código cuya política de uso impida compartirlo.',
    },
    {
        title: 'Mientras trabajas con un agente',
        description: 'Pide un plan y acota los archivos que puede tocar. Revisa los comandos antes de ejecutarlos, en especial si instalan paquetes, eliminan archivos o acceden a servicios externos.',
    },
    {
        title: 'Antes de integrar el cambio',
        description: 'Lee el diff y comprueba que puedes explicar el resultado. Ejecuta las pruebas del proyecto, verifica las dependencias nuevas y revisa la licencia del código que incorpores.',
    },
    {
        title: 'Al usar IA en la búsqueda de empleo',
        description: 'Úsala para practicar entrevistas o mejorar la claridad de tu CV. Comprueba cada afirmación y conserva únicamente habilidades, fechas y resultados que puedas respaldar. Usa un CV anonimizado en servicios externos.',
    },
];

export default function ResponsibleAiPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black md:text-5xl">IA responsable en el IDE</h1>
            <p className="subtle mt-5 max-w-3xl text-lg leading-8">
                Decide qué contexto compartes, qué permisos das y cómo vas a verificar el trabajo generado.
            </p>
            <PromptBuilder />
            <AiVerificationArena />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
                {steps.map(({ title, description }) => (
                    <section key={title} className="panel p-6">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="subtle mt-3 leading-7">{description}</p>
                    </section>
                ))}
            </div>
            <ReviewChecklist title="Revisión antes de compartir o integrar" items={[
                'Usé datos ficticios y verifiqué los permisos del asistente.',
                'Revisé cada cambio y puedo explicar cómo funciona.',
                'Ejecuté las pruebas y registré qué falta comprobar.',
                'Verifiqué las licencias y las dependencias incorporadas.',
            ]} />
            <Link href="/ide" className="btn-secondary mr-2 mt-8">Ver extensiones para el IDE</Link>
            <Link href="/herramientas#plantillas" className="btn-primary mt-8">Abrir plantilla para pedir cambios en el IDE</Link>
        </main>
    );
}