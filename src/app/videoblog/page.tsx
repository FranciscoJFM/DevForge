import type { Metadata } from 'next';
import Link from 'next/link';
import VideoEpisode from '@/components/VideoEpisode';

export const metadata: Metadata = { title: 'Videoblog de DevForge' };

export default function Videoblog() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Videoblog de DevForge</h1>
        <p className="subtle mt-4 max-w-2xl">Sigue el primer episodio por escenas, lee la transcripción o activa la narración de tu navegador.</p>
        <VideoEpisode />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/api-studio" className="btn-secondary">Practicar en API Studio</Link>
            <Link href="/ejemplos" className="btn-secondary">Ver el código</Link>
        </div>
    </main>;
}
