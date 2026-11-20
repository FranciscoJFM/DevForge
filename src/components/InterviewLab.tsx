"use client";

import { useState } from 'react';

const questions = [
    ['Salesforce', 'Inicial', '¿Qué diferencia hay entre un constructor y un método en Apex? Crea una clase que reciba un nombre y devuelva un saludo.', ['El constructor tiene el nombre de la clase y carece de tipo de retorno.', 'El constructor guarda el nombre en la instancia.', 'El método devuelve el saludo y puedes verificarlo con una prueba.']],
    ['Salesforce', 'Intermedio', 'Un trigger consulta contactos dentro de un bucle. ¿Cómo lo rediseñarías para procesar varios registros?', ['Recoge los identificadores en un Set.', 'Haz una consulta SOQL fuera del bucle y organiza los resultados en un Map.', 'Prueba con una colección de registros, además de un solo registro.']],
    ['Android', 'Inicial', '¿Cómo representarías una pantalla que carga datos remotos?', ['Describe estados de carga, éxito, vacío y error.', 'Mantén el estado en un ViewModel.', 'Explica qué debe pasar al reintentar.']],
    ['Android', 'Intermedio', 'Diseña una pantalla Compose que guarde un formulario y mantenga lo escrito al girar el dispositivo.', ['Usa estado observable y un mecanismo de restauración adecuado.', 'Valida antes de enviar y evita envíos duplicados.', 'Comprueba cambios de orientación, errores de red y mensajes accesibles.']],
    ['React y JavaScript', 'Inicial', 'Haz un formulario con un campo de nombre. ¿Cuándo se puede enviar?', ['El campo tiene una etiqueta.', 'Rechaza valores vacíos o solo espacios.', 'Mantén lo escrito cuando falle el envío.']],
    ['React y JavaScript', 'Intermedio', 'Una búsqueda muestra respuestas antiguas al escribir rápido. ¿Cómo lo evitarías?', ['Describe el orden en que pueden llegar las respuestas.', 'Cancela la solicitud anterior o ignora respuestas obsoletas.', 'Prueba dos solicitudes con diferentes demoras.']],
    ['SQL y APIs', 'Inicial', 'Escribe un SELECT que obtenga el identificador y el nombre de los clientes de una tabla.', ['Selecciona columnas explícitas.', 'Indica la tabla en FROM.', 'Explica cómo agregar filtros con parámetros.']],
    ['SQL y APIs', 'Intermedio', 'Una integración REST recibe un 429. ¿Qué harías antes de reintentar?', ['Distingue un límite temporal de errores permanentes.', 'Respeta Retry-After cuando exista y limita los intentos.', 'Considera si la operación se puede repetir sin duplicar efectos.']],
] as const;

export default function InterviewLab() {
    const [index, setIndex] = useState(0);
    const [response, setResponse] = useState('');
    const [reveal, setReveal] = useState(false);
    const [checks, setChecks] = useState([false, false, false]);
    const [area, level, question, rubric] = questions[index];

    return <section className="panel mt-8 p-6">
        <label className="block">Tema y nivel<select className="field mt-2" value={index} onChange={event => {
            setIndex(Number(event.target.value));
            setResponse('');
            setReveal(false);
            setChecks([false, false, false]);
        }}>{questions.map(([topic, difficulty], item) => <option key={topic + difficulty} value={item}>{topic} · {difficulty}</option>)}</select></label>
        <h2 className="mt-5 text-xl font-bold">{area} · {level}</h2>
        <p className="mt-3">{question}</p>
        <label className="mt-5 block">Tu respuesta<textarea className="field mt-2 min-h-40" value={response} onChange={event => setResponse(event.target.value)} /></label>
        <button className="btn-primary mt-4" type="button" aria-expanded={reveal} onClick={() => setReveal(!reveal)}>{reveal ? 'Ocultar criterios' : 'Comparar con los criterios'}</button>
        {reveal && <fieldset className="mt-5 space-y-3">
            <legend className="mb-3 font-semibold">Marca los criterios que cubriste</legend>
            {rubric.map((item, criterion) => <label key={item} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" checked={checks[criterion]} onChange={event => setChecks(current => current.map((value, key) => key === criterion ? event.target.checked : value))} />{item}
            </label>)}
            <p role="status" className="subtle">{checks.filter(Boolean).length} de {rubric.length} criterios marcados. Completa lo que falta y vuelve a explicar tu solución.</p>
        </fieldset>}
    </section>;
}
