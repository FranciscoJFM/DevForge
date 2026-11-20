import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Git y repositorios para equipos' };

const commands = [
    ['Antes de cambiar archivos', 'git status -sb\ngit log --oneline -5', 'Confirma en qué rama estás y qué cambios tienes pendientes.'],
    ['Crear una rama de trabajo', 'git switch -c feat/documentar-api', 'Parte desde la base del equipo y usa un nombre relacionado con la tarea.'],
    ['Revisar qué irá al commit', 'git diff\ngit add docs/api.md\ngit diff --staged', 'Agrega solo los archivos necesarios y busca credenciales o archivos generados antes de confirmar.'],
    ['Confirmar y subir tu rama', 'git commit -m "Documenta el contrato REST"\ngit push -u origin feat/documentar-api', 'Comparte una rama de trabajo para abrir una revisión con contexto, pruebas e impacto.'],
    ['Comparar antes de revisar', 'git fetch origin\ngit diff origin/main...HEAD', 'Usa el nombre de la rama base de tu equipo. Lee los cambios del código y las pruebas.'],
    ['Revertir un cambio compartido', 'git revert <id-del-commit>', 'Sustituye el marcador por el commit revisado. Git crea un commit inverso que puedes someter a revisión.'],
];

export default function GitPage() {
    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Git y repositorios para equipos</h1>
        <p className="subtle mt-4 max-w-3xl leading-7">Sigue un cambio desde tu rama local hasta la revisión. Usa Git para hacer visible qué cambió, por qué y cómo se probó.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
            {commands.map(([title, code, tip]) => <article key={title} className="panel p-6">
                <h2 className="text-xl font-bold">{title}</h2>
                <pre className="field mt-4 overflow-auto"><code>{code}</code></pre>
                <p className="subtle mt-3">{tip}</p>
            </article>)}
        </div>
        <section className="panel mt-7 p-6">
            <h2 className="text-xl font-bold">Qué buscar en un repositorio</h2>
            <p className="subtle mt-3">Revisa README, licencia, instrucciones de prueba e historial reciente. Antes de incorporar código, comprueba los permisos de uso y prueba el ejemplo en un proyecto aparte.</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[color:var(--accent)]">
                <li><a href="https://git-scm.com/docs/git">Documentación de Git</a></li>
                <li><a href="https://github.com/trailheadapps/lwc-recipes">Recetas LWC de Salesforce</a></li>
                <li><a href="https://github.com/android/nowinandroid">Now in Android de Google</a></li>
            </ul>
        </section>
        <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/revision-codigo" className="btn-primary">Abrir la lista de revisión de código</Link>
            <Link href="/foro" className="btn-secondary">Recomendar un repositorio en el foro</Link>
        </div>
    </main>;
}
