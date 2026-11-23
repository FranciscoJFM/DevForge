import type { Metadata } from 'next';
import RescueCenter from '@/components/RescueCenter';

export const metadata: Metadata = {
    title: 'Rescue Center',
    description: 'Diagnóstico práctico para errores de código, despliegues, problemas laborales, aprendizaje y código generado por IA.',
};

export default function RescueCenterPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <RescueCenter />
        </main>
    );
}
