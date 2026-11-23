import type { Metadata } from 'next';
import Link from 'next/link';
import QuickFixes from '@/components/QuickFixes';
import CustomDiagnostic from '@/components/CustomDiagnostic';

export const metadata: Metadata = { title: 'Debug Lab', description: 'Diagnósticos reproducibles de Next.js, Salesforce REST y SOAP.' };

const cases = [
    {
        id: 'hidratacion', title: 'Next.js: el menú falla al hidratar',
        symptom: 'El diff de React muestra «Proyectos» en el cliente y «Empleo digno» en el HTML.',
        cause: 'En el caso de DevForge, el navegador y el servidor estaban usando distintas versiones del menú.',
        before: 'HTML: /empleo → Empleo digno\nCliente: /proyectos → Proyectos',
        after: 'HTML y JavaScript del mismo build\n/empleo → Empleo digno',
        check: 'Recarga solicitando los recursos nuevos y comprueba los scripts de la respuesta en Network. Abre /empleo directamente y verifica que React arranca sin un error de hidratación.',
        href: '/empleo', action: 'Abrir Empleo',
    },
    {
        id: 'soql', title: 'Salesforce REST: el parámetro q llega incompleto',
        symptom: 'Una consulta que funciona por separado falla o cambia al pasarla como parámetro de URL.',
        cause: 'Un ampersand, signo más u otro carácter puede cambiar cómo se interpreta la cadena de consulta.',
        before: 'const path = base + "?q=" + soql;',
        after: 'const path = base + "?" + new URLSearchParams({ q: soql });',
        check: 'Prueba con un valor como A&B. Al leer q con URLSearchParams, la consulta debe coincidir con la original, incluidos los caracteres especiales.',
        href: '/herramientas#integraciones', action: 'Preparar una consulta',
    },
    {
        id: 'soap', title: 'SOAP: el servicio no reconoce la operación',
        symptom: 'El XML está bien formado, pero el servicio devuelve un SOAP Fault al interpretar el elemento de Body.',
        cause: 'El nombre local coincide con la operación, pero el namespace del elemento difiere del definido por el WSDL.',
        before: '<m:Consultar xmlns:m="urn:otro-servicio" />',
        after: '<m:Consultar xmlns:m="urn:mi-servicio" />',
        check: 'Compara el nombre y la URI del elemento con el esquema del WSDL de tu servicio. Las URI del ejemplo son ficticias.',
        href: '/herramientas#integraciones', action: 'Preparar un sobre SOAP',
    },
];

export default function DebugLab() {
    return (
        <main className="containerx py-16">
            <h1 className="text-4xl font-black">Debug Lab</h1>
            <p className="subtle mt-4">Diagnostica un síntoma, aplica el cambio y comprueba el resultado.</p>
            <CustomDiagnostic />
            <Link className="btn-primary mt-5" href="/retos">Practicar con un ticket</Link>
            <div className="mt-8 space-y-6">
                {cases.map(item => (
                    <article key={item.id} id={item.id} className="panel scroll-mt-24 p-6">
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p className="subtle mt-3">{item.symptom}</p>
                        <p className="subtle mt-2">{item.cause}</p>
                        <div className="my-5 grid gap-4 md:grid-cols-2">
                            <div><h3 className="mb-2 font-semibold">Antes</h3><pre className="field overflow-auto"><code>{item.before}</code></pre></div>
                            <div><h3 className="mb-2 font-semibold">Corrección</h3><pre className="field overflow-auto"><code>{item.after}</code></pre></div>
                        </div>
                        <h3 className="font-semibold">Cómo comprobarlo</h3>
                        <p className="subtle mt-2">{item.check}</p>
                        <Link className="btn-secondary mt-4" href={item.href}>{item.action}</Link>
                    </article>
                ))}
            </div>
            <QuickFixes />
        </main>
    );
}