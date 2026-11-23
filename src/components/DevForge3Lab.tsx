"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Lab = 'doctor' | 'tests' | 'architecture' | 'performance' | 'config' | 'git' | 'release' | 'career';

const labs: { id: Lab; label: string }[] = [
    { id: 'doctor', label: 'DevDoctor' },
    { id: 'tests', label: 'TestForge' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'performance', label: 'Performance' },
    { id: 'config', label: 'Config Diff' },
    { id: 'git', label: 'Git Rescue' },
    { id: 'release', label: 'Release Guardian' },
    { id: 'career', label: 'Entrevista y carrera' },
];

function copyText(text: string) {
    if (!text) return Promise.reject(new Error('No hay contenido'));
    return navigator.clipboard.writeText(text);
}

export default function DevForge3Lab() {
    const [lab, setLab] = useState<Lab>('doctor');
    const [technology, setTechnology] = useState('Next.js / React');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [testFramework, setTestFramework] = useState('Jest');
    const [architecture, setArchitecture] = useState('Cliente web\nAPI Next.js\nPostgreSQL');
    const [configLeft, setConfigLeft] = useState('REGION=mx-central\nCACHE=true\nTIMEOUT=3000');
    const [configRight, setConfigRight] = useState('REGION=mx-central\nCACHE=false\nTIMEOUT=5000');
    const [gitAction, setGitAction] = useState('cherry-pick');
    const [careerMode, setCareerMode] = useState('Entrevista');
    const [responseStyle, setResponseStyle] = useState('Colaborativo');

    async function copyResult() {
        try {
            await copyText(result);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    }

    function diagnose() {
        const value = error.toLowerCase();
        const findings: string[] = [];
        if (/401|unauthorized|credencial|token/.test(value)) findings.push('La autorización puede haber expirado, estar ausente o usar otro entorno.');
        if (/500|internal server/.test(value)) findings.push('Revisa la causa del servidor y correlaciona el log con el mismo identificador de solicitud.');
        if (/hydration|hidrata|server-rendered/.test(value)) findings.push('Compara el HTML inicial y el estado creado por el cliente. Evita leer diferencias entre navegador y servidor.');
        if (/timeout|timed out|network/.test(value)) findings.push('Mide DNS, conexión, límites y tiempo del servicio antes de aumentar el timeout.');
        if (/soql|apex|salesforce/.test(value)) findings.push('Verifica bulkificación, límites de SOQL y datos de prueba fuera de producción.');
        if (!findings.length) findings.push('No hay una causa suficiente. Reproduce el caso con datos mínimos y conserva el mensaje exacto.');
        setResult(`DevDoctor · ${technology}

Hechos a confirmar:
- Tecnología: ${technology}
- Error: ${error.trim() || '[sin mensaje]'}

Hipótesis:
${findings.map(item => `- ${item}`).join('\n')}

Prueba de diagnóstico:
1. Reproduce una sola vez con datos ficticios.
2. Anota entorno, versión, hora y pasos.
3. Cambia una variable por intento.
4. Conserva una prueba que falle antes y pase después.

Validación:
- Corrige una causa por intento.
- Ejecuta la prueba mínima.
- Revisa efectos laterales y regresiones.
- Documenta qué quedó sin comprobar.`);
    }

    function generateTests() {
        const templates: Record<string, string> = {
            Jest: `test('caso positivo', () => {\n  expect(resolver('Demo')).toBe('esperado');\n});\n\ntest('entrada vacía', () => {\n  expect(() => resolver('')).toThrow('Entrada requerida');\n});\n\ntest('caso límite', () => {\n  expect(resolver('x'.repeat(255))).toBeDefined();\n});`,
            JUnit: `@Test\nvoid casoPositivo() {\n    assertEquals("esperado", resolver("Demo"));\n}\n\n@Test\nvoid entradaVacia() {\n    assertThrows(IllegalArgumentException.class, () -> resolver(""));\n}`,
            Pytest: `def test_caso_positivo():\n    assert resolver("Demo") == "esperado"\n\ndef test_entrada_vacia():\n    with pytest.raises(ValueError):\n        resolver("")\n\ndef test_caso_limite():\n    assert resolver("x" * 255) is not None`,
            Apex: `@IsTest\nstatic void casoPositivo() {\n    System.assertEquals('esperado', resolver('Demo'));\n}\n\n@IsTest\nstatic void entradaVacia() {\n    System.assertEquals('', resolver(''));\n}`,
        };
        setResult(`TestForge · ${testFramework}

Caso positivo:
- Entrada válida y resultado esperado explícito.

Caso negativo:
- Entrada nula, vacía o formato inválido.

Casos límite:
- Colección vacía, valor máximo, longitud máxima y duplicados.

Plantilla:
\`\`\`${testFramework === 'Apex' ? 'apex' : testFramework === 'JUnit' ? 'java' : testFramework === 'Pytest' ? 'python' : 'typescript'}
${templates[testFramework]}
\`\`\`

Antes de ejecutar:
1. Sustituye resolver por la función real.
2. Aísla dependencias.
3. Usa datos ficticios.
4. Ejecuta el caso positivo antes de ampliar.`);
    }

    function generateMermaid() {
        const nodes = architecture.split('\n').map(item => item.trim()).filter(Boolean);
        const lines = ['flowchart LR'];
        nodes.forEach((node, index) => {
            const id = `N${index + 1}`;
            lines.push(`  ${id}[\"${node.replaceAll('"', '')}\"]`);
            if (index > 0) lines.push(`  N${index} --> ${id}`);
        });
        setResult(`Mermaid:
\`\`\`mermaid
${lines.join('\n')}
\`\`\`

Revisión:
- Confirma límites de confianza.
- Marca datos sensibles y secretos.
- Añade dependencias externas.
- Identifica qué componente falla primero.`);
    }

    function compareConfig() {
        const left = Object.fromEntries(configLeft.split('\n').map(line => {
            const separator = line.indexOf('=');
            return separator > -1 ? [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] : [line.trim(), ''];
        }).filter(([key]) => key));
        const right = Object.fromEntries(configRight.split('\n').map(line => {
            const separator = line.indexOf('=');
            return separator > -1 ? [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] : [line.trim(), ''];
        }).filter(([key]) => key));
        const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
        const differences = keys.filter(key => left[key] !== right[key]).map(key =>
            `- ${key}: ${left[key] ?? '(ausente)'} → ${right[key] ?? '(ausente)'}`);
        setResult(`Config Diff

${differences.length ? differences.join('\n') : 'No hay diferencias detectadas.'}

No se incluyen ni validan secretos. Sustituye valores reales por ejemplos antes de compartir el reporte.`);
    }

    function gitPlan() {
        const plans: Record<string, string> = {
            'cherry-pick': 'cherry-pick aplica un commit específico sobre la rama actual. Anota su hash, revisa conflictos y crea una rama de respaldo.',
            'revert': 'revert crea una operación nueva que deshace un commit anterior. Es preferible a reescribir un historial compartido.',
            'rebase': 'rebase mueve commits sobre otra base. No lo ejecutes sobre una rama compartida sin coordinarlo.',
            'recovery': 'Antes de recuperar, conserva reflog y estado actual. Identifica el commit o rama perdido y crea una referencia nueva.',
        };
        setResult(`Git Rescue · ${gitAction}

${plans[gitAction]}

Escenario seguro:
1. Crea una rama de respaldo.
2. Ejecuta el cambio en una copia.
3. Revisa el diff y conflictos.
4. Verifica compilación y pruebas.`);
    }

    function careerPlan() {
        const career = careerMode === 'Entrevista'
            ? 'Explica problema, supuestos, solución, trade-offs, complejidad y pruebas.'
            : careerMode === 'Negociación'
                ? 'Describe hechos, impacto y opciones. Pide un acuerdo concreto con responsable y fecha.'
                : 'Selecciona el siguiente rol, identifica tres brechas y crea una evidencia para cada una.';
        setResult(`${careerMode} · Plan local

${career}

Resultado verificable:
- Contexto sin datos personales.
- Evidencia observable.
- Riesgo o limitación.
- Próximo paso y fecha de seguimiento.`);
    }

    function releaseCheck() {
        setResult(`Release Guardian

- [ ] Alcance y dependencias confirmados
- [ ] Migraciones o cambios de datos revisados
- [ ] Pruebas ejecutadas y registradas
- [ ] Variables y secretos comprobados sin mostrarlos
- [ ] Dependencias bloqueadas o documentadas
- [ ] Procedimiento de rollback definido
- [ ] Monitoreo y criterios de éxito definidos
- [ ] Responsable y hora de revisión acordados

Procedimiento sugerido:
1. Desplegar a un entorno pequeño o pilotado.
2. Confirmar una prueba funcional.
3. Vigilar métricas y errores.
4. Mantener rollback disponible hasta cumplir el período acordado.`);
    }

    function runPerformance() {
        setResult(`Performance Lab

Antes de medir:
- Usa el mismo entorno y datos.
- Conserva versión, hardware y carga.
- Ejecuta tres calentamientos y tres mediciones.
- Mide latencia, duración y errores.
- Compara el enfoque con el mismo timeout.

Registro recomendado:
Escenario | p50 | p95 | errores | notas

No atribuyas causalidad con una sola medición ni compares máquinas distintas.`);
    }

    function runLab() {
        if (lab === 'doctor') diagnose();
        if (lab === 'tests') generateTests();
        if (lab === 'architecture') generateMermaid();
        if (lab === 'performance') runPerformance();
        if (lab === 'config') compareConfig();
        if (lab === 'git') gitPlan();
        if (lab === 'release') releaseCheck();
        if (lab === 'career') careerPlan();
    }

    return (
        <section className="devforge3-lab panel mt-8 p-5 md:p-7" aria-labelledby="devforge3-lab-title">
            <h2 id="devforge3-lab-title" className="text-2xl font-bold">Laboratorio interactivo</h2>
            <div className="devforge3-lab-tabs mt-5" role="tablist" aria-label="Laboratorios">
                {labs.map(item => <button key={item.id} type="button" role="tab" aria-selected={lab === item.id} className="btn-secondary" onClick={() => { setLab(item.id); setResult(''); }}>{item.label}</button>)}
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                    {lab === 'doctor' && <>
                        <label className="block"><span className="mb-2 block font-bold">Tecnología</span><select className="field" value={technology} onChange={event => setTechnology(event.target.value)}><option>Next.js / React</option><option>Salesforce / Apex</option><option>Android / Kotlin</option><option>Java / Spring</option><option>Python</option><option>SQL / API</option></select></label>
                        <label className="mt-4 block"><span className="mb-2 block font-bold">Error o síntoma</span><textarea className="field min-h-36" value={error} onChange={event => setError(event.target.value)} placeholder="Ejemplo: una llamada autenticada devuelve HTTP 401 después de una hora." /></label>
                    </>}
                    {lab === 'tests' && <label className="block"><span className="mb-2 block font-bold">Framework</span><select className="field" value={testFramework} onChange={event => setTestFramework(event.target.value)}><option>Jest</option><option>JUnit</option><option>Pytest</option><option>Apex</option></select></label>}
                    {lab === 'architecture' && <label className="block"><span className="mb-2 block font-bold">Componentes, uno por línea</span><textarea className="field min-h-36" value={architecture} onChange={event => setArchitecture(event.target.value)} /></label>}
                    {lab === 'performance' && <p className="subtle">Genera un protocolo de medición comparable. No ejecuta carga ni envía datos a terceros.</p>}
                    {lab === 'config' && <div className="grid gap-4"><label><span className="mb-2 block font-bold">Entorno A</span><textarea className="field min-h-36 font-mono" value={configLeft} onChange={event => setConfigLeft(event.target.value)} /></label><label><span className="mb-2 block font-bold">Entorno B</span><textarea className="field min-h-36 font-mono" value={configRight} onChange={event => setConfigRight(event.target.value)} /></label></div>}
                    {lab === 'git' && <label className="block"><span className="mb-2 block font-bold">Operación</span><select className="field" value={gitAction} onChange={event => setGitAction(event.target.value)}><option value="cherry-pick">Cherry-pick</option><option value="revert">Revert</option><option value="rebase">Rebase</option><option value="recovery">Recuperación</option></select></label>}
                    {lab === 'release' && <p className="subtle">Genera una checklist de liberación y reversión sin asumir aprobaciones que no existan.</p>}
                    {lab === 'career' && <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block font-bold">Formato</span><select className="field" value={careerMode} onChange={event => setCareerMode(event.target.value)}><option>Entrevista</option><option>Negociación</option><option>Carrera</option></select></label><label><span className="mb-2 block font-bold">Estilo</span><select className="field" value={responseStyle} onChange={event => setResponseStyle(event.target.value)}><option>Colaborativo</option><option>Firme</option><option>Formal</option></select></label></div>}
                    <button type="button" className="btn-primary mt-4" onClick={runLab}>Generar resultado</button>
                </div>
                <div>
                    <div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-bold">Resultado</h3>{result && <button type="button" className="btn-secondary" onClick={copyResult}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copiado' : 'Copiar'}</button>}</div>
                    {result ? <pre className="devforge3-result field max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm" aria-live="polite"><code>{result}</code></pre> : <p className="subtle">Elige una herramienta y genera un resultado local. No se envía contenido a un servidor.</p>}
                </div>
            </div>
        </section>
    );
}
