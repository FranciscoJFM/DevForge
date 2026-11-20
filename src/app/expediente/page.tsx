import type { Metadata } from 'next';
import ProjectDossier from '@/components/ProjectDossier';
import { practiceTickets } from '@/lib/practiceTickets';
import { studyTracks } from '@/lib/studyTracks';

export const metadata: Metadata = { title: 'Expediente de proyecto' };

export default async function DossierPage({ searchParams }: { searchParams: Promise<{ ruta?: string; ticket?: string }> }) {
    const { ruta, ticket } = await searchParams;
    const track = studyTracks.find(item => item.slug === ruta);
    const practice = practiceTickets.find(item => item.id === ticket);
    const initial = practice ? {
        title: practice.title,
        objective: practice.report,
        requirements: practice.acceptance.map(item => '- ' + item).join('\n'),
        ticketId: practice.id,
    } : {
        title: track ? 'Proyecto de ' + track.name : '',
        objective: track?.project ?? '',
        requirements: '',
    };

    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Expediente de proyecto</h1>
            <p>Reúne tus requisitos, decisiones, pruebas y aprendizajes. Importa tu plan de trabajo o empieza desde una ruta de Academia. Los archivos se preparan en tu navegador.</p>
        </header>
        <ProjectDossier key={track?.slug ?? practice?.id ?? 'blank'} initial={initial} />
    </main>;
}
