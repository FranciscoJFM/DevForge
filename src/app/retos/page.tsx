import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeTickets from '@/components/PracticeTickets';

export const metadata: Metadata = { title: 'Retos basados en tickets' };

export default function TicketsPage() {
    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Retos basados en tickets</h1>
            <p>Investiga un incidente ficticio, propón una solución y explica cómo verificarías el cambio. Después, compara tu enfoque con una solución comentada.</p>
        </header>
        <PracticeTickets />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/debug" className="btn-secondary">Consultar Debug Lab</Link>
            <Link href="/academia" className="btn-secondary">Ver rutas de estudio</Link>
        </div>
    </main>;
}
