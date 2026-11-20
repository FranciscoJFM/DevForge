"use client";

import { useState } from 'react';

const rules = [
    { id: 'dynamic-code', pattern: /\beval\s*\(|\bnew\s+Function\s*\(/, title: 'Ejecución dinámica', message: 'Comprueba quién controla el texto. Si solo necesitas leer datos, usa un parser del formato esperado.' },
    { id: 'markup', pattern: /\binnerHTML\s*=|dangerouslySetInnerHTML/, title: 'HTML insertado directamente', message: 'Rastrea el origen de los datos. Para texto, usa textContent o el renderizado normal del framework.' },
    { id: 'credential', pattern: /\b(?:password|secret|api_?key|token)\s*[:=]\s*["'][^"']{8,}["']/i, title: 'Posible credencial literal', message: 'Determina si es un valor ficticio. Si es real, reemplázalo por configuración segura y sigue el procedimiento de rotación de tu equipo.' },
    { id: 'empty-catch', pattern: /\bcatch\b[^{}]*\{\s*\}/, title: 'Excepción ignorada', message: 'Explica por qué se puede ignorar el error o proporciona una respuesta que conserve contexto y permita diagnosticarlo.' },
    { id: 'long-line', pattern: /^.{141}/, title: 'Línea extensa', message: 'Divide expresiones o extrae un nombre si eso aclara la intención. Revisa el formato acordado en el repositorio.' },
    { id: 'select-all', pattern: /\bselect\s+\*\s+from\b/i, title: 'Consulta sin columnas explícitas', message: 'Comprueba qué columnas necesita el consumidor y si conviene seleccionarlas de forma explícita.' },
];
const sample = 'function render(container, apiText) {\n    container.innerHTML = apiText;\n}\n\ntry {\n    render(panel, response);\n} catch (error) {}';

function inspect(code: string) {
    return code.split(/\r?\n/).flatMap((line, index) => rules.filter(rule => rule.pattern.test(line))
        .map(rule => ({ ...rule, line: index + 1 })));
}

export default function CodeReview() {
    const [source, setSource] = useState('');
    const [findings, setFindings] = useState<ReturnType<typeof inspect>>();
    return <section className="panel mt-8 p-6">
        <h2 className="text-xl font-bold">Revisión por reglas</h2>
        <p className="subtle mt-3">Busca señales por línea en el navegador. Verifica cada sugerencia con el contexto y las pruebas del proyecto.</p>
        <label className="mt-4 block font-semibold">Código para revisar
            <textarea value={source} className="field mt-2 min-h-52 font-mono" maxLength={30000} spellCheck={false} onChange={event => {
                setSource(event.target.value);
                setFindings(undefined);
            }} />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary disabled:opacity-50" disabled={!source.trim()} onClick={() => setFindings(inspect(source))}>Revisar fragmento</button>
            <button type="button" className="btn-secondary" onClick={() => { setSource(sample); setFindings(undefined); }}>Cargar ejemplo</button>
        </div>
        {findings && <div className="mt-5">
            <p role="status" className="subtle">{findings.length ? findings.length + ' señales para revisar.' : 'Estas reglas no encontraron coincidencias. Continúa con la revisión manual.'}</p>
            <ul className="mt-3 space-y-3">{findings.slice(0, 80).map(item => <li key={item.id + '-' + item.line} className="rounded-lg border border-[color:var(--input-line)] p-3">
                <strong>Línea {item.line} · {item.title}</strong>
                <p className="subtle mt-1">{item.message}</p>
            </li>)}</ul>
            {findings.length > 80 && <p className="subtle mt-2">Se muestran las primeras 80 señales.</p>}
        </div>}
    </section>;
}
