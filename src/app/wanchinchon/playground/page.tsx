import type { Metadata } from 'next';
import WanchinchonLab from '@/components/WanchinchonLab';

export const metadata: Metadata = {
    title: 'Wanchinchon Playground',
    description: 'Editor ejecutable de Wanchinchon con consola, estado, traza y explicación.',
};

export default function WanchinchonPlaygroundPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro">
                <p className="hero-topic">Construir</p>
                <h1 className="mt-3">Wanchinchon Playground</h1>
                <p>Edita, ejecuta, guarda y explica programas sin enviar el código a un servidor.</p>
            </header>
            <WanchinchonLab />
        </main>
    );
}
