import type { Metadata } from 'next';
import Link from 'next/link';
import ReviewChecklist from '@/components/ReviewChecklist';

export const metadata: Metadata = { title: 'Revisar una vacante técnica' };

export default function VacancyPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Revisa una vacante técnica</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Lee la oferta y marca los puntos que están claros. Convierte los demás en preguntas antes de compartir datos personales, invertir horas en una prueba o aceptar.</p>
        <ReviewChecklist title="Qué preguntar sobre la vacante" items={[
            'Distingue las tareas habituales de los conocimientos que se pueden aprender en el puesto.',
            'Aclara el rango salarial, el tipo de contrato y las prestaciones.',
            'Define el horario, las guardias y cómo se compensan.',
            'Indica cuántas etapas hay, cuánto dura la prueba y cómo se evaluará.',
            'Puedes verificar quién contrata sin entregar documentos sensibles ni pagar para continuar.',
        ]} />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/herramientas#plantillas" className="btn-secondary">Preparar preguntas por escrito</Link>
            <Link href="/entrevistas" className="btn-primary">Practicar una entrevista</Link>
        </div>
    </main>;
}
