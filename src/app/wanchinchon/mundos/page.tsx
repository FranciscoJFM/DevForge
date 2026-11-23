import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Mundos Wanchinchon' };

const worlds = [
    { title: 'Casa', description: 'Un niño pide su wanchonchin y cambia su estado.', href: '/wanchinchon/playground', code: 'mundo Casa\n  ser Niño\n    rasgo feliz = verdadero\n  fin\nfin' },
    { title: 'Invernadero', description: 'Un sensor revisa la humedad y activa el riego.', href: '/wanchinchon/playground', code: 'mundo Invernadero\n  ser Sensor\n    rasgo humedad = 20\n  fin\nfin' },
    { title: 'Mi primer proyecto', description: 'Una calculadora combina funciones y variables.', href: '/wanchinchon/aprender', code: 'mundo Calculadora\n  dice 7 + 5\nfin' },
];

export default function WanchinchonWorldsPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro"><p className="hero-topic">Galería 0.2</p><h1 className="mt-3">Explora mundos</h1><p>Empieza por ejemplos pequeños y observa cómo cambian sus seres y sucesos.</p></header>
            <div className="grid-cards mt-8">{worlds.map(world => <article key={world.title} className="panel p-5"><h2 className="text-xl font-bold">{world.title}</h2><p className="subtle mt-2">{world.description}</p><pre className="field mt-4 overflow-auto text-sm"><code>{world.code}</code></pre><Link className="btn-primary mt-4" href={world.href}>Abrir en DevForge</Link></article>)}</div>
        </main>
    );
}
