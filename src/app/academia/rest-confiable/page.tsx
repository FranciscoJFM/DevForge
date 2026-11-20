import type { Metadata } from 'next';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const metadata: Metadata = {
    title: 'Cómo consumir una API REST de forma confiable',
    description: 'Tutorial de Node.js con tiempos de espera, errores HTTP, validación del JSON y pruebas reproducibles.',
};

const cases = [
    ['200 y datos válidos', 'Devuelve solo id y title.'],
    ['404 o 500', 'Conserva el código HTTP. La interfaz puede distinguir un pedido inexistente de un fallo remoto.'],
    ['Tiempo agotado', 'Cancela la espera y devuelve un error de tipo timeout.'],
    ['JSON incompleto o inválido', 'Distingue fallos de formato de respuestas que incumplen el contrato.'],
    ['Red caída o ID inválido', 'Distingue conexión fallida de un dato de entrada incorrecto.'],
];

export default async function RestLessonPage() {
    const code = await readFile(join(process.cwd(), 'public', 'examples', 'cliente-pedidos.mjs'), 'utf8');

    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Cómo consumir una API REST de forma confiable</h1>
            <p>Consume un pedido, valida la respuesta y distingue los errores para decidir qué puede hacer la persona usuaria.</p>
        </header>
        <p className="subtle mt-4">Nivel intermedio · Node.js 22 o superior · Conocimientos previos de promesas, HTTP y JSON</p>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Escenario y arquitectura</h2>
            <p className="subtle mt-3">Una persona consulta un pedido. La interfaz llama a su propio servicio y el servidor consulta al proveedor. En esta práctica, JSONPlaceholder representa al proveedor y una publicación representa un pedido ficticio.</p>
            <pre className="field mt-4 overflow-auto"><code>{'Interfaz → Servicio de pedidos → Cliente REST → API de práctica'}</code></pre>
            <p className="subtle mt-3">El cliente devuelve un pedido o un error que la interfaz puede usar para mostrar un mensaje adecuado. La API externa no controla el estado de la pantalla.</p>
        </section>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Implementación paso a paso</h2>
            <ol className="subtle mt-3 list-decimal space-y-2 pl-5">
                <li>Valida el identificador antes de construir la URL.</li>
                <li>Aplica un tiempo máximo y revisa el estado HTTP antes de leer el cuerpo.</li>
                <li>Interpreta el JSON como datos externos. Comprueba el identificador y el título antes de devolver el pedido.</li>
            </ol>
            <pre className="field mt-4 max-h-[34rem] overflow-auto text-sm"><code>{code}</code></pre>
            <div className="mt-5 flex flex-wrap gap-3">
                <a className="btn-primary" href="/examples/cliente-pedidos.mjs" download>Descargar código</a>
                <a className="btn-secondary" href="/examples/cliente-pedidos.test.mjs" download>Descargar pruebas</a>
            </div>
        </section>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Pruebas y errores frecuentes</h2>
            <p className="subtle mt-3">Guarda ambos archivos en la misma carpeta y ejecuta <code>node --test cliente-pedidos.test.mjs</code>. Las pruebas simulan respuestas y fallos de red sin depender del servicio público.</p>
            <dl className="mt-4 space-y-3">{cases.map(([label, expected]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="subtle">{expected}</dd></div>)}</dl>
        </section>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Al llevarlo a un proyecto real</h2>
            <p className="subtle mt-3">Mantén las credenciales en el servidor. Registra estado, duración e identificador de seguimiento sin volcar datos sensibles. Si reintentas un GET ante un fallo temporal, limita los intentos y respeta Retry-After. En escrituras, verifica primero si repetir la operación podría duplicar efectos.</p>
            <p className="mt-4 font-semibold">Tu ejercicio</p>
            <p className="subtle mt-1">Agrega una función que convierta un 404 en «Pedido inexistente» y un 500 en «Servicio temporalmente indisponible». Añade una prueba para cada caso y documenta cómo verificarías el cambio después de desplegarlo.</p>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link className="btn-secondary" href="/integration-lab">Reproducir errores en el laboratorio</Link>
                <Link className="btn-secondary" href="/expediente">Guardar la evidencia</Link>
                <a className="text-link self-center" href="https://jsonplaceholder.typicode.com/guide/">Guía de la API de práctica</a>
            </div>
        </section>
    </main>;
}
