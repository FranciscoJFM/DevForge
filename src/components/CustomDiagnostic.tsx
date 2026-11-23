"use client";

import { useState } from 'react';

export default function CustomDiagnostic() {
    const [technology, setTechnology] = useState('Next.js / React');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    function diagnose() {
        const text = error.toLowerCase();
        const hypotheses: string[] = [];
        if (/401|unauthor|token|credencial/.test(text)) hypotheses.push('El acceso puede estar vencido, ausente o pertenecer a otro entorno.');
        if (/500|internal server/.test(text)) hypotheses.push('Hay una excepción o configuración en el servidor; relaciona el mensaje con el mismo request ID.');
        if (/404|not found/.test(text)) hypotheses.push('Revisa ruta, método, host y si el recurso existe en el entorno actual.');
        if (/cors|origin|preflight/.test(text)) hypotheses.push('El origen, método o encabezados no coinciden con la política CORS del servidor.');
        if (/hydration|hidrata/.test(text)) hypotheses.push('El HTML inicial y el estado del cliente pueden diferir al ejecutar o serializar datos.');
        if (/timeout|timed out/.test(text)) hypotheses.push('Mide DNS, conexión, servicio dependiente y timeout; no aumentes el límite sin evidencia.');
        if (/soql|apex/.test(text)) hypotheses.push('Revisa bulkificación, límites de SOQL, tipos de datos y datos de prueba.');
        if (/soap|wsdl|namespace/.test(text)) hypotheses.push('Compara operación, namespace y estructura del Body con el WSDL real.');
        if (!hypotheses.length) hypotheses.push('No hay suficiente evidencia. Reduce el caso a datos ficticios y conserva el mensaje exacto.');

        setResult(`Diagnóstico para ${technology}

Síntoma:
${error.trim() || 'Sin mensaje proporcionado'}

Hipótesis a comprobar:
${hypotheses.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Antes de cambiar código:
1. Reproduce una sola vez.
2. Registra entorno, versión y pasos.
3. Cambia una variable por intento.
4. Conserva el valor antes y después.

Validación:
- Ejecuta una prueba mínima.
- Comprueba estados vacío, inválido y exitoso.
- Revisa regresiones y efectos laterales.
- Documenta qué no pudo verificarse.`);
    }

    return (
        <section className="panel mt-8 p-6" aria-labelledby="custom-diagnostic-title">
            <h2 id="custom-diagnostic-title" className="text-2xl font-bold">Diagnosticar un error propio</h2>
            <p className="subtle mt-2">Genera hipótesis locales sin enviar el error a una IA. No reemplaza logs ni reproducciones reales.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-[18rem_1fr]">
                <label><span className="mb-2 block font-semibold">Tecnología</span><select className="field" value={technology} onChange={event => setTechnology(event.target.value)}><option>Next.js / React</option><option>Salesforce / Apex</option><option>Android / Kotlin</option><option>Java / Spring</option><option>Python</option><option>SQL / API</option><option>SOAP / XML</option></select></label>
                <label><span className="mb-2 block font-semibold">Mensaje o síntoma</span><textarea className="field min-h-28" value={error} onChange={event => setError(event.target.value)} placeholder="Ejemplo: HTTP 401 al consumir la API después de una hora" /></label>
            </div>
            <button type="button" className="btn-primary mt-4" onClick={diagnose}>Generar diagnóstico</button>
            {result && <pre className="field mt-5 max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm" aria-live="polite"><code>{result}</code></pre>}
        </section>
    );
}
