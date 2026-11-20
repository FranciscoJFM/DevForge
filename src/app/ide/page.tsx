import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Extensiones y herramientas para tu IDE' };

const recommendations = [
    { group: 'Salesforce', name: 'Salesforce Extensions for VS Code', use: 'Edita Apex y LWC, trabaja con proyectos Salesforce DX y ejecuta pruebas desde el editor.', href: 'https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/vscode-overview.html' },
    { group: 'Web', name: 'ESLint para VS Code', use: 'Ve advertencias en el archivo mientras escribes. Usa la configuración y dependencias del repositorio.', href: 'https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint' },
    { group: 'Equipos y repositorios', name: 'EditorConfig', use: 'Comparte reglas simples de indentación y saltos de línea entre editores con un archivo .editorconfig.', href: 'https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig' },
    { group: 'Integraciones', name: 'REST Client para VS Code', use: 'Guarda solicitudes de ejemplo en archivos .http y ejecútalas desde el editor. Usa variables locales para las credenciales.', href: 'https://marketplace.visualstudio.com/items?itemName=humao.rest-client' },
    { group: 'Android', name: 'Layout Inspector de Android Studio', use: 'Inspecciona la jerarquía y las propiedades de una pantalla que se está ejecutando. Viene integrado en Android Studio.', href: 'https://developer.android.com/studio/debug/layout-inspector' },
];

export default function IdePage() {
    return <main className="containerx py-12 md:py-16">
        <header className="page-intro">
            <h1>Extensiones y herramientas para tu IDE</h1>
            <p>Elige según lo que necesitas hacer: probar Apex, revisar el formato de un repositorio, inspeccionar pantallas o documentar solicitudes.</p>
        </header>
        <div className="grid-cards mt-8">
            {recommendations.map(item => <article className="panel flex flex-col p-5" key={item.name}>
                <p className="text-sm font-semibold text-[color:var(--accent)]">{item.group}</p>
                <h2 className="mt-2 text-xl font-bold">{item.name}</h2>
                <p className="subtle mt-2 flex-1">{item.use}</p>
                <a href={item.href} aria-label={'Ver fuente oficial: ' + item.name} className="text-link mt-4">Ver fuente oficial</a>
            </article>)}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-secondary" href="/ia-responsable">Permisos y privacidad en el IDE</Link>
            <Link className="btn-secondary" href="/cliente-http">Probar una API en DevForge</Link>
        </div>
    </main>;
}
