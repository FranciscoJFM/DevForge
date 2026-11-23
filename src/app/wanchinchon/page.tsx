import type { Metadata } from 'next';
import WanchinchonLab from '@/components/WanchinchonLab';

export const metadata: Metadata = {
    title: 'Wanchinchon Lang',
    description: 'Laboratorio de un lenguaje educativo de mundos y sucesos inspirado en una creación familiar.',
};

export default function WanchinchonPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro">
                <p className="hero-topic">Lenguajes y mundos imaginados</p>
                <h1 className="mt-3">Wanchinchon Lang</h1>
                <p>Programa seres, vínculos y sucesos con una sintaxis diseñada para explicar cómo cambia un mundo.</p>
            </header>
            <WanchinchonLab />
        </main>
    );
}
