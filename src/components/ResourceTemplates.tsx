"use client";

import { useState } from 'react';
import ToolHelp, { HelpText } from './ToolHelp';
import { toolStacks, type ToolStack } from '@/lib/toolStacks';

const templates = [
    {
        label: 'Pedir apoyo ante un trato irrespetuoso',
        text: 'El [fecha], durante [contexto], observé [hecho específico]. Esto afectó [impacto en el trabajo]. Solicito [medida concreta] y un seguimiento por [canal seguro] en [fecha]. Puedo compartir la información necesaria por una vía acordada.',
    },
    {
        label: 'Negociar alcance y capacidad',
        text: 'Fecha de entrega: [fecha].\nTrabajo en curso: [tareas].\nNueva petición e impacto: [esfuerzo, pruebas y dependencias].\nSi mantenemos la fecha, propongo mover [tarea]. ¿Cuál priorizamos?\nAcuerdo, responsable y fecha de revisión: [completar].',
    },
    {
        label: 'Acordar horarios, urgencias y guardias',
        text: 'Horario de contacto: [días y horas].\nQué cuenta como urgencia: [criterios].\nCanal para urgencias: [canal].\nCobertura y rotación de guardias: [acuerdo].\nDescanso y entrega de turno: [acuerdo].\nFecha de revisión: [fecha].',
    },
    {
        label: 'Seguimiento de postulaciones',
        text: 'Empresa | Puesto | Enlace | Fecha | Estado | Próximo paso',
    },
    {
        label: 'Preguntas antes de aceptar una oferta',
        text: 'Hola, gracias por la oferta. Antes de decidir, ¿podrían confirmarme por escrito el salario bruto, el horario, la modalidad, el tipo de contrato y las prestaciones? También quisiera saber cómo gestionan las guardias y el tiempo extra.',
    },
    {
        label: 'Bitácora laboral',
        text: 'Fecha y hora:\nHecho observado:\nQué se había acordado:\nImpacto:\nDónde se encuentra la documentación autorizada:\nRespuesta recibida y próximo paso:',
    },
    {
        label: 'Mensaje para plantear un problema',
        text: 'Hola, quisiera revisar lo ocurrido el [fecha]. Observé [hecho concreto] y esto afectó [impacto]. Solicito [cambio concreto]. ¿Podemos acordar por escrito los próximos pasos y una fecha de seguimiento?',
    },
    {
        label: 'Instrucción para un asistente en el IDE',
        text: 'Objetivo: [resultado y criterio de aceptación].\nContexto: [ejemplo mínimo con datos ficticios].\nAlcance: [archivos permitidos].\nPropón un plan breve antes de editar. Pide autorización para instalar dependencias, ejecutar comandos que cambien datos o acceder a servicios externos. Indica las pruebas ejecutadas y qué queda por verificar.',
    },
    {
        label: 'CV adaptado a una vacante',
        text: 'Nombre y contacto profesional:\nPuesto objetivo:\nResumen enfocado a la vacante:\nLogro 1 (acción, contexto y resultado):\nLogro 2 (acción, contexto y resultado):\nTecnologías que puedes demostrar:\nProyecto o portafolio:',
    },
    {
        label: 'Correo para enviar un CV',
        text: 'Asunto: Postulación a [puesto] | [nombre]\n\nHola, [equipo o persona]:\n\nMe postulo a [puesto]. Mi experiencia en [actividad] se relaciona con [tarea de la vacante]. Adjunto mi CV y quedo disponible para conversar.\n\nGracias,\n[nombre y contacto]',
    },
    {
        label: 'CV en inglés · Resume',
        text: 'Name and professional contact:\nTarget role:\nProfessional summary:\nAchievement (action, context and result):\nTechnical skills:\nProject or portfolio:',
    },
    {
        label: 'Correo de postulación en inglés',
        text: 'Subject: Application for [role] | [name]\n\nHi [name or Hiring Team],\nI am applying for the [role] position. My experience with [skill or project] aligns with [specific responsibility]. I have attached my resume and would be happy to discuss the role.\n\nThank you,\n[name]',
    },
];

const filledExamples = [
    'En la revisión del martes se hicieron comentarios descalificadores sobre mi trabajo delante del equipo. Solicito que revisemos los cambios pendientes en una reunión privada y acordemos el seguimiento para el viernes.',
    'La entrega del viernes incluye el formulario y sus pruebas. La nueva integración requiere un día adicional. Si mantenemos la fecha, propongo mover el reporte al siguiente ciclo. ¿Cuál priorizamos?',
    'Horario: lunes a viernes, 9 a 18 h.\nUrgencia: caída del servicio en producción.\nCanal: avisar a la persona de guardia.\nRevisión del acuerdo: primer lunes del mes.',
    'Empresa ficticia | Desarrollador Android | example.invalid/vacante | 12 de marzo | Entrevista agendada | Preparar un ejemplo de manejo de estado',
    'Gracias por la oferta. ¿Podrían confirmar por escrito si el rango publicado es bruto, cómo se rotan las guardias y cuáles son las etapas antes de firmar?',
    'Martes, 10:00. Se movió la fecha de entrega al mismo día. El acuerdo anterior era el jueves. Quedaron pendientes dos pruebas. Próximo paso: confirmar prioridad por escrito.',
    'En la revisión de ayer se cambió el alcance sin registrar la decisión. Quedaron dos tareas con la misma fecha. Pido que definamos la prioridad y la registremos en el tablero.',
    undefined,
    'Puesto objetivo: Desarrollador Salesforce junior.\nLogro: Documenté los casos de error de una integración y preparé datos ficticios para repetir las pruebas antes de liberar.',
    'Asunto: Postulación a Desarrollador Salesforce | Alex Rivera\n\nHola, equipo de selección. He documentado integraciones REST y preparado casos de prueba, dos tareas de la vacante. Adjunto mi CV. Gracias, Alex.',
    'Target role: Junior Salesforce Developer.\nAchievement: Documented REST integration flows and wrote regression tests so the team could reproduce errors before release.',
    'Subject: Application for Android Developer | Alex Rivera\n\nHi Hiring Team,\nI am applying for the Android Developer role. I built a Kotlin app and tested its offline behavior. I have attached my resume and would be happy to discuss the role.\n\nThank you,\nAlex Rivera',
];

export default function ResourceTemplates({ stack }: { stack: ToolStack }) {
    const [selected, setSelected] = useState(0);
    const [status, setStatus] = useState('');
    const template = templates[selected];
    const text = template.label === 'Instrucción para un asistente en el IDE'
        ? 'Tecnología: ' + toolStacks[stack].label + '\nPruebas sugeridas: ' + toolStacks[stack].verification + '\n\n' + template.text
        : template.text;

    async function copyTemplate() {
        try {
            await navigator.clipboard.writeText(text);
            setStatus('Plantilla copiada.');
        } catch {
            setStatus('Selecciona y copia el texto manualmente.');
        }
    }

    return (
        <section id="plantillas" aria-labelledby="templates-heading" className="panel mt-8 scroll-mt-24 p-6">
            <h2 id="templates-heading" className="text-xl font-bold">Plantillas para empleo, trabajo e IA</h2>
            <p className="subtle mt-2 leading-7">Copia una plantilla y complétala en un documento privado.</p>
            <label htmlFor="resource-template" className="mt-5 block font-semibold">Elige una plantilla</label>
            <select
                id="resource-template"
                className="field mt-2"
                value={selected}
                onChange={event => {
                    setSelected(Number(event.target.value));
                    setStatus('');
                }}
            >
                {templates.map(({ label }, index) => <option key={label} value={index}>{label}</option>)}
            </select>
            <ToolHelp key={template.label} title="Ayuda y ejemplo de la plantilla">
                <p className="subtle">El ejemplo usa datos ficticios. El botón de copiar conserva la plantilla para que la completes con tu situación.</p>
                <HelpText>{filledExamples[selected] ?? ('Tecnología: ' + toolStacks[stack].label
                    + '\nObjetivo: valida el nombre antes de guardar una cuenta de ejemplo.'
                    + '\nAlcance: edita solo el formulario y sus pruebas.'
                    + '\nVerificación: ' + toolStacks[stack].verification)}</HelpText>
            </ToolHelp>
            <textarea aria-label={template.label} className="field mt-4 min-h-48" readOnly value={text} />
            <button type="button" className="btn-primary mt-4" onClick={copyTemplate}>Copiar plantilla</button>
            <p role="status" className="subtle mt-2 text-sm">{status}</p>
        </section>
    );
}