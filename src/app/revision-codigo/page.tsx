import type { Metadata } from 'next';
import Link from 'next/link';
import CodeReview from '@/components/CodeReview';
import ReviewChecklist from '@/components/ReviewChecklist';

export const metadata: Metadata = { title: 'Revisión de código, Clean Code y SOLID' };

const principles = [
    ['Responsabilidad única', 'Separa el cálculo del total de la lógica que imprime o envía la cotización. Prueba el cálculo sin crear una interfaz.'],
    ['Abierto a extensión', 'Modela descuentos como políticas intercambiables cuando distintas reglas cambian de forma independiente.'],
    ['Sustitución de Liskov', 'Si dos implementaciones comparten un contrato, usa las mismas pruebas para verificar sus resultados y condiciones de error.'],
    ['Segregación de interfaces', 'Dale al listado un contrato de lectura. Reserva escritura y borrado para clientes que los necesiten.'],
    ['Inversión de dependencias', 'Pasa el cliente de API al servicio como dependencia. En pruebas, reemplázalo por uno que devuelva respuestas controladas.'],
];

export default function ReviewPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Revisión de código</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Pega un fragmento para explorar señales de mantenimiento y seguridad. Usa la lista de revisión para evaluar lo que requiere criterio humano.</p>
        <CodeReview />
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Clean Code en una revisión</h2>
            <p className="subtle mt-3">Usa nombres que expresen la intención, separa efectos externos de cálculos y escribe una prueba para cada comportamiento que cambie.</p>
            <pre className="field mt-4 overflow-auto whitespace-pre-wrap"><code>{'// Antes\nif (u && u.s === 1) { enviar(u); }\n\n// Después\nif (usuario?.estado === Estado.Activo) {\n    enviarNotificacion(usuario);\n}'}</code></pre>
        </section>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">SOLID con ejemplos</h2>
            <dl className="mt-4 grid gap-4 md:grid-cols-2">{principles.map(([name, example]) => <div key={name}>
                <dt className="font-semibold">{name}</dt><dd className="subtle mt-1">{example}</dd>
            </div>)}</dl>
        </section>
        <ReviewChecklist title="Antes de aprobar un cambio" items={[
            'El diff resuelve el problema y cubre errores y casos límite con pruebas.',
            'Las entradas se validan y las operaciones sensibles verifican permisos del lado servidor.',
            'Las consultas usan parámetros y las respuestas o registros evitan exponer credenciales.',
            'Los nombres, dependencias y comentarios permiten entender y mantener el cambio.',
        ]} />
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/git" className="btn-secondary">Inspeccionar cambios con Git</Link>
            <Link href="/seguridad" className="btn-secondary">Consultar seguridad aplicada</Link>
            <Link href="/playground" className="btn-secondary">Probar una versión en JavaScript</Link>
        </div>
    </main>;
}
