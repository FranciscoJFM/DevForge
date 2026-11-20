import type { Metadata } from 'next';
import Link from 'next/link';
import LiveApiClient from '@/components/LiveApiClient';

export const metadata: Metadata = { title: 'Cliente HTTP para APIs REST' };

export default function HttpClientPage() {
    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Prueba una API en vivo</h1>
            <p>Elige un ejemplo o pega la URL de tu API. Envía una petición e inspecciona el estado, el tiempo y la respuesta.</p>
        </header>
        <LiveApiClient />
        <section className="panel mt-6 p-5">
            <h2 className="text-xl font-bold">APIs de práctica</h2>
            <p className="subtle mt-3">JSONPlaceholder responde a las escrituras con datos de prueba y simula su persistencia. PokéAPI sirve consultas de solo lectura.</p>
            <div className="mt-4 flex flex-wrap gap-4">
                <a className="text-link" href="https://jsonplaceholder.typicode.com/guide/">Guía de JSONPlaceholder</a>
                <a className="text-link" href="https://pokeapi.co/docs/v2">Documentación de PokéAPI</a>
                <Link className="text-link" href="/integration-lab">Abrir el laboratorio simulado</Link>
            </div>
        </section>
    </main>;
}
