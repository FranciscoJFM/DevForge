import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Wanchinchon Docs' };

const sections = [
    { title: 'Primeros pasos', items: [['mundo', 'Declara el entorno del programa.'], ['dice', 'Muestra un valor en la consola.'], ['fin', 'Cierra mundos y bloques.']] },
    { title: 'Datos y funciones', items: [['chon', 'Variable reasignable.'], ['fijo', 'Constante.'], ['hacer', 'Declara una función con parámetros y resultado.'], ['devuelve', 'Termina una función con un valor.']] },
    { title: 'Seres y sucesos', items: [['ser', 'Define una entidad o tipo.'], ['nace', 'Constructor de una entidad.'], ['vinculo', 'Relaciona seres de forma informativa.'], ['cuando', 'Registra una regla reactiva.'], ['ocurre / emite', 'Dispara o encola un suceso.']] },
];

export default function WanchinchonDocsPage() {
    return (
        <main className="containerx py-10 md:py-16">
            <header className="page-intro"><p className="hero-topic">Wanchinchon Docs · 0.2</p><h1 className="mt-3">Manual del lenguaje</h1><p>Referencia práctica de la sintaxis que sí está disponible en DevForge.</p></header>
            <nav className="jump-nav mt-6" aria-label="Secciones de documentación"><a href="#datos">Tipos y datos</a><a href="#control">Control</a><a href="#seres">Seres y sucesos</a><a href="#limites">Compatibilidad</a></nav>
            {sections.map(section => <section className="mt-8" key={section.title}><h2 className="section-title">{section.title}</h2><div className="grid-cards mt-4">{section.items.map(([name, detail]) => <article key={name} className="panel p-5"><code className="text-[color:var(--accent)]">{name}</code><p className="subtle mt-2">{detail}</p></article>)}</div></section>)}
            <section id="datos" className="panel mt-8 p-6"><h2 className="text-xl font-bold">Tipos disponibles</h2><p className="subtle mt-3"><code>texto</code>, <code>numero</code>, <code>decimal</code>, <code>logico</code>, <code>nada</code> y nombres de seres.</p><pre className="field mt-4 overflow-auto text-sm"><code>{'chon edad: numero = 7\nchon nombre: texto = "Evan"\nfijo activo: logico = verdadero'}</code></pre></section>
            <section id="control" className="panel mt-5 p-6"><h2 className="text-xl font-bold">Operadores y control</h2><p className="subtle mt-3">Aritméticos: <code>+ - * / %</code>. Comparación: <code>== != &lt; &gt; &lt;= &gt;=</code>. Condiciones: <code>si / sino</code>. Repetición: <code>repite ... veces</code>.</p><pre className="field mt-4 overflow-auto text-sm"><code>{'si edad >= 7\n  dice "Edad suficiente"\nsino\n  dice "Edad menor"\nfin\n\nrepite 3 veces\n  dice "Hola"\nfin'}</code></pre></section>
            <section id="seres" className="panel mt-5 p-6"><h2 className="text-xl font-bold">Seres, constructores y métodos</h2><pre className="field mt-4 overflow-auto text-sm"><code>{'ser Persona\n  rasgo nombre: texto = "Sin nombre"\n  nace(nombre: texto)\n    yo.nombre = nombre\n  fin\n  hacer saluda() -> texto\n    devuelve "Hola, soy " + yo.nombre\n  fin\nfin\n\nchon persona = crea Persona("Evan")\ndice persona.saluda()'}</code></pre></section>
            <section id="limites" className="panel mt-5 p-6"><h2 className="text-xl font-bold">Limitaciones conocidas de 0.2</h2><ul className="subtle mt-3 list-disc space-y-2 pl-5"><li>No hay módulos, imports, interfaces, tipos genéricos ni async.</li><li>No hay compilación nativa .exe ni FFI.</li><li>La ejecución ocurre en el navegador con límites de sucesos y acciones.</li><li>El verificador estático aún no cubre todos los errores de flujo.</li></ul></section>
            <div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary" href="/wanchinchon/aprender">Hacer una lección</Link><Link className="btn-secondary" href="/wanchinchon/playground">Abrir playground</Link></div>
        </main>
    );
}
