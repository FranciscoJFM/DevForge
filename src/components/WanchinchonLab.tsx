"use client";

import { useMemo, useState } from 'react';
import { run, WanError } from '@/lib/wanchinchon';
import { parseV2, runV2, WanV2Error } from '@/lib/wanchinchon-v2';

const examples = {
    familia02: `mundo Familia
  ser Persona
    rasgo nombre: texto = "Sin nombre"
    rasgo edad: numero = 0
    nace(nombre: texto, edad: numero)
      yo.nombre = nombre
      yo.edad = edad
    fin
    hacer saluda() -> texto
      devuelve "Hola, soy " + yo.nombre
    fin
  fin

  hacer doble(n: numero) -> numero
    devuelve n * 2
  fin

  chon hijo = crea Persona("Luna", 8)
  dice hijo.saluda()
  dice doble(hijo.edad)

  si hijo.edad >= 8
    dice "Edad suficiente"
  sino
    dice "Edad menor"
  fin
fin`,
    casa: `# wanchonchin = toalla
mundo Casa
  palabra wanchonchin = "toalla"
  ser Niño
    rasgo humor = tranquilo
    rasgo lugar = cuarto
  fin
  ser Wanchonchin
    rasgo lugar = baño
    rasgo limpio = verdadero
  fin
  vinculo Niño necesita Wanchonchin
  cuando Niño pide Wanchonchin
    dice "El niño pidió su wanchonchin"
    mueve Wanchonchin a Niño
    cambia Niño.humor = feliz
  fin
  ocurre Niño pide Wanchonchin
fin`,
    invernadero: `mundo Invernadero
  ser Sensor
    rasgo humedad = 20
  fin
  ser Planta
    rasgo estado = seca
    rasgo agua = 0
  fin
  vinculo Sensor observa Planta
  cuando Sensor revisa Planta
    si Sensor.humedad < 30
      cambia Planta.agua = 1
      cambia Planta.estado = regada
      dice "Riego automático activado"
    fin
  fin
  ocurre Sensor revisa Planta
fin`,
};

export default function WanchinchonLab() {
    const [source, setSource] = useState(examples.familia02);
    const [example, setExample] = useState<'familia02' | 'casa' | 'invernadero'>('familia02');
    const [output, setOutput] = useState<ReturnType<typeof run> | null>(null);
    const [error, setError] = useState('');

    function execute() {
        setError('');
        try {
            const isV2 = /\b(chon|fijo|hacer|nace|crea|repite|sino)\b/.test(source);
            if (isV2) {
                const ast = parseV2(source);
                const result = runV2(ast);
                setOutput({
                    ast: { entities: Object.entries(ast.entities).map(([name, entity]) => ({ name, traits: Object.fromEntries(Object.entries(entity.traits).map(([trait, details]) => [trait, details.expression ?? null])), line: 1 })) },
                    result: {
                        world: result.world,
                        dictionary: {},
                        state: result.state,
                        links: [],
                        messages: result.messages,
                        trace: result.trace,
                        processed: result.trace.filter(entry => entry.type === 'event').length,
                    },
                } as unknown as ReturnType<typeof run>);
            } else {
                setOutput(run(source, { maxEvents: 1000, maxActions: 10000 }));
            }
        } catch (nextError) {
            setOutput(null);
            setError(nextError instanceof WanError || nextError instanceof WanV2Error ? nextError.message : 'No fue posible ejecutar el mundo.');
        }
    }

    function changeExample(next: 'familia02' | 'casa' | 'invernadero') {
        setExample(next);
        setSource(examples[next]);
        setOutput(null);
        setError('');
    }

    const graph = useMemo(() => output?.ast.entities ?? [], [output]);

    return (
        <section className="panel mt-8 p-5 md:p-7" aria-labelledby="wanchinchon-title">
            <p className="mini-tag">Lenguaje experimental</p>
            <h2 id="wanchinchon-title" className="mt-3 text-2xl font-bold">Wanchinchon Lang</h2>
            <p className="subtle mt-2 max-w-3xl leading-7">
                Modo experimental 0.1/0.2. Solo la palabra «wanchonchin» proviene del niño; las demás palabras son propuestas técnicas. 0.2 incluye variables, funciones, constructores, métodos, expresiones y control de flujo. Los módulos, HTTP, async y compilación nativa siguen pendientes.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="block"><span className="mb-2 block font-bold">Ejemplo</span><select className="field" value={example} onChange={event => changeExample(event.target.value as 'familia02' | 'casa' | 'invernadero')}><option value="familia02">Familia 0.2</option><option value="casa">Casa 0.1</option><option value="invernadero">Invernadero 0.1</option></select></label>
                    <label className="mt-4 block"><span className="mb-2 block font-bold">Programa .wan</span><textarea className="field min-h-[28rem] font-mono text-sm" value={source} spellCheck={false} onChange={event => setSource(event.target.value)} /></label>
                    <button type="button" className="btn-primary mt-4" onClick={execute}>Ejecutar mundo</button>
                </div>
                <div>
                    {error && <p className="rounded-lg border border-[color:var(--danger)] p-4 text-[color:var(--danger)]" role="alert">{error}</p>}
                    {output && <>
                        <h3 className="font-bold">Grafo de seres</h3>
                        <div className="mt-3 grid grid-cols-2 gap-3" aria-label="Grafo de seres y vínculos">
                            {graph.map(entity => (
                                <article key={entity.name} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--well)] p-4">
                                    <strong>{entity.name}</strong>
                                    <ul className="subtle mt-2 space-y-1 text-sm">
                                        {Object.entries(output.result.state[entity.name]).map(([trait, value]) => <li key={trait}>{trait}: {String(value)}</li>)}
                                    </ul>
                                </article>
                            ))}
                        </div>
                        {output.result.links.length > 0 && <p className="subtle mt-3">Vínculos: {output.result.links.map(link => `${link.from} ${link.relation} ${link.to}`).join(' · ')}</p>}
                        <h3 className="mt-5 font-bold">Mensajes</h3>
                        <pre className="field mt-2 min-h-20 whitespace-pre-wrap text-sm"><code>{output.result.messages.join('\n') || '(Sin mensajes)'}</code></pre>
                        <h3 className="mt-5 font-bold">Estado</h3>
                        <pre className="field mt-2 max-h-64 overflow-auto text-sm"><code>{JSON.stringify(output.result.state, null, 2)}</code></pre>
                        <h3 className="mt-5 font-bold">Trazabilidad</h3>
                        <ol className="mt-2 space-y-2">
                            {output.result.trace.map((entry, index) => <li key={index} className="rounded-lg border border-[color:var(--line)] p-3 text-sm">
                                {entry.type === 'event' ? `Suceso: ${String(entry.event)}` :
                                    entry.type === 'change' ? `Cambio: ${String(entry.entity)}.${String(entry.trait)} = ${String(entry.after)}` :
                                        entry.type === 'move' ? `Movimiento: ${String(entry.entity)} a ${String(entry.to)}` :
                                            entry.type === 'message' ? `Mensaje: ${String(entry.value)}` :
                                                entry.type === 'emit' ? `Emite: ${String(entry.event)}` :
                                                    entry.type === 'condition' ? `Condicion: ${entry.passed ? 'sí' : 'no'}` : entry.type}
                            </li>)}
                        </ol>
                    </>}
                </div>
            </div>
        </section>
    );
}
