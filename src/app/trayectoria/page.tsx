import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'De documentación a desarrollo' };

export default function CareerStoryPage() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black md:text-5xl">De documentación a desarrollo</h1>
            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-8">
                <p className="subtle">Empecé como documentador. Después me dieron la oportunidad de aprender Android y Java. Con el tiempo también trabajé con Salesforce, desarrollo web, Tableau y analítica.</p>
                <p className="subtle">Aprender un stack nuevo lleva práctica. Lo que ya sabes sobre datos, pruebas, depuración y comunicación te da un punto de partida. Documentar un flujo también ayuda a entenderlo y explicarlo cuando toca implementarlo.</p>
                <p className="subtle">Si quieres cambiar de stack, empieza con un problema que ya conozcas y resuélvelo en la tecnología nueva. Si lideras un equipo, abre esa oportunidad con una tarea acotada, tiempo para aprender y alguien que pueda revisar el primer cambio.</p>
            </div>
            <Link href="/desarrollo#cambiar-de-stack" className="btn-primary mt-8">Ver el mapa para cambiar de stack</Link>
        </main>
    );
}