import Link from 'next/link';

const fixes = [
    [
        "soql-en-bucle",
        "Salesforce",
        "Una consulta SOQL se ejecuta dentro del bucle",
        "Primero, busca si el método procesa un lote y si la consulta usa un identificador distinto en cada iteración.",
        "Reúne los IDs, consulta una vez y agrupa por AccountId si necesitas recorrer los resultados por cuenta.",
        "Set<Id> accountIds = new Map<Id, Account>(accounts).keySet();\nList<Contact> contacts = [\n    SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds\n];",
        "Ejecuta una prueba Apex con varias cuentas y contactos. Verifica los resultados y comprueba que la consulta no aumenta por cada cuenta."
    ],
    [
        "cors",
        "Integraciones",
        "El navegador bloquea la respuesta por CORS",
        "En Network revisa el origen del sitio, la respuesta OPTIONS si existe y los encabezados que devuelve el servidor.",
        "En una API que administras, permite el origen de tu sitio, el método y los encabezados necesarios. Si la API es de terceros, usa su mecanismo oficial de acceso.",
        "Access-Control-Allow-Origin: https://app.example.invalid\nVary: Origin",
        "Repite la petición en Cliente HTTP y comprueba que el navegador pueda leer el estado y el cuerpo. Revisa también un origen que deba quedar fuera."
    ],
    [
        "conflicto-git",
        "Git",
        "Git detiene una combinación por un conflicto",
        "Usa git status para ver qué operación está en curso. Revisa qué archivos aparecen como no fusionados.",
        "Abre cada archivo, conserva la intención de ambos cambios y retira los marcadores del conflicto. Agrega solo el archivo resuelto y sigue la instrucción de git status.",
        "git status\ngit diff --name-only --diff-filter=U\n# Después de resolver y probar el archivo:\ngit add -- src/archivo.ts",
        "Confirma que no queden archivos sin fusionar. Ejecuta las pruebas de lo que tocaste antes de terminar la operación."
    ]
];

export default function QuickFixes() {
    return <section id="quickfix" className="mt-10 scroll-mt-24" aria-labelledby="quickfix-heading">
        <h2 id="quickfix-heading" className="section-title">QuickFix</h2>
        <p className="subtle mt-3">Busca una causa probable, aplica una corrección y comprueba el resultado.</p>
        <div className="mt-5 space-y-4">
            {fixes.map(([id, area, title, first, change, code, test]) => <article id={id} className="panel scroll-mt-24 p-5" key={id}>
                <p className="text-sm font-semibold text-[color:var(--accent)]">{area}</p>
                <h3 className="mt-1 text-xl font-bold">{title}</h3>
                <p className="subtle mt-3"><strong>Qué revisar primero.</strong> {first}</p>
                <p className="subtle mt-2"><strong>Qué cambiar.</strong> {change}</p>
                <pre className="field mt-3 overflow-auto text-sm"><code>{code}</code></pre>
                <p className="subtle mt-3"><strong>Cómo comprobarlo.</strong> {test}</p>
            </article>)}
        </div>
        <Link href="/retos" className="btn-secondary mt-5">Practicar con un ticket</Link>
    </section>;
}
