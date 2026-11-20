import { memoryFields } from './technicalMemory';

export const studioTemplates = {
    memoria: {
        title: 'Memoria técnica',
        description: 'Explica la arquitectura, el contrato y cómo verificar la solución.',
        fields: memoryFields.map(field => ({ title: field.title, tip: 'Indica qué está confirmado y qué falta validar.', example: field.example })),
    },
    funcional: {
        title: 'Diseño funcional',
        description: 'Alinea el alcance con las personas que usan y validan el sistema.',
        fields: [
            { title: 'Necesidad y alcance', tip: 'Describe quién necesita el cambio y qué queda fuera.', example: 'El equipo de atención busca pedidos por ID. Este cambio incluye la consulta y deja fuera la edición.' },
            { title: 'Actores y permisos', tip: 'Enumera roles y operaciones permitidas.', example: 'Una persona de atención puede consultar pedidos. La supervisión revisa fallos y derivaciones.' },
            { title: 'Flujo principal y alternativos', tip: 'Incluye el resultado exitoso, sin datos y con error.', example: '1. Escribir el ID.\n2. Seleccionar Buscar.\n3. Mostrar el pedido o indicar si no existe. Si el servicio falla, conservar el ID.' },
            { title: 'Reglas y validaciones', tip: 'Registra límites y mensajes esperados.', example: 'El ID debe ser un entero positivo. La consulta inválida muestra un mensaje junto al campo.' },
            { title: 'Criterios de aceptación', tip: 'Escribe resultados que otra persona pueda comprobar.', example: 'Con el ID 1, se muestra el pedido ficticio. Con ID vacío, se indica que falta el identificador.' },
        ],
    },
    contrato: {
        title: 'Contrato de integración',
        description: 'Documenta un servicio REST o SOAP, sus errores y la evidencia prevista.',
        fields: [
            { title: 'Protocolo, endpoint y operación', tip: 'Indica método y ruta o WSDL, operación y namespace.', example: 'REST GET /posts/{id} sobre JSONPlaceholder. La publicación representa un pedido ficticio.' },
            { title: 'Autenticación y permisos', tip: 'Referencia la configuración. Mantén los secretos en su almacén.', example: 'La API ficticia es pública. El proveedor definitivo y sus permisos quedan pendientes de confirmar.' },
            { title: 'Solicitud y respuesta', tip: 'Incluye tipos, campos requeridos y un ejemplo anonimizado.', example: 'Solicitud: ID entero positivo en la ruta.\nRespuesta 200: { "id": 1, "title": "Pedido demo" }.\nAmbos campos son obligatorios.' },
            { title: 'Errores y tiempos de espera', tip: 'Relaciona cada error con una acción del consumidor.', example: '404: mostrar pedido inexistente.\n503: indicar indisponibilidad temporal.\nTiempo máximo de prueba: cinco segundos.' },
            { title: 'Reintentos e idempotencia', tip: 'Describe cuándo se puede repetir la operación.', example: 'Para GET, comprueba Retry-After antes de repetir un fallo temporal. Verifica la idempotencia antes de reintentar escrituras.' },
            { title: 'Pruebas y monitoreo', tip: 'Incluye escenarios verificables y qué registrar.', example: 'Verificar 200, 404, 503, timeout y JSON inesperado. Registrar duración y estado HTTP sin guardar el cuerpo.' },
        ],
    },
    liberacion: {
        title: 'Plan de liberación',
        description: 'Coordina la entrega, las comprobaciones y la decisión de revertir.',
        fields: [
            { title: 'Versión y entorno', tip: 'Identifica la revisión, ambiente y responsable.', example: 'Versión de práctica 1.0.0 en QA. La fecha y la persona responsable quedan por confirmar.' },
            { title: 'Inventario y dependencias', tip: 'Incluye componentes, configuración y relaciones.', example: 'Aplicación web, cliente REST y contrato de pedidos. Verificar configuración del proveedor, permisos y pruebas.' },
            { title: 'Antes de liberar', tip: 'Verifica pruebas, versiones y respaldo aplicable.', example: 'Ejecutar pruebas, confirmar revisión del cambio y registrar el identificador de la versión anterior.' },
            { title: 'Pasos de despliegue', tip: 'Detalla secuencia, propietarios y puntos de parada.', example: '1. Confirmar la ventana.\n2. Verificar configuración en QA.\n3. Liberar el artefacto revisado.\n4. Ejecutar la comprobación posterior.' },
            { title: 'Verificación posterior', tip: 'Define el flujo principal y qué señales monitorear.', example: 'Consultar el pedido ficticio y revisar errores HTTP y duración. Guardar evidencia sin datos sensibles.' },
            { title: 'Reversión y aprobaciones', tip: 'Define quién decide, el criterio y cómo recuperar.', example: 'Detener la liberación si la consulta principal falla. Confirmar el procedimiento con el equipo antes de restaurar la versión anterior.' },
        ],
    },
    qa: {
        title: 'Matriz QA/UAT',
        description: 'Registra escenarios, resultados y evidencia en una hoja editable.',
        fields: [],
    },
} as const;
export type TemplateId = keyof typeof studioTemplates;
export type QaCase = {
    scenario: string;
    conditions: string;
    steps: string;
    expected: string;
    actual: string;
    evidence: string;
    defect: string;
    owner: string;
    status: string;
};

export const qaColumns = [
    ['scenario', 'Escenario'], ['conditions', 'Precondiciones'], ['steps', 'Pasos'],
    ['expected', 'Resultado esperado'], ['actual', 'Resultado real'], ['evidence', 'Evidencia'],
    ['defect', 'Defecto'], ['owner', 'Responsable'], ['status', 'Estado'],
] as const;

export const emptyCase: QaCase = { scenario: '', conditions: '', steps: '', expected: '', actual: '', evidence: '', defect: '', owner: '', status: 'Pendiente' };

export function apiCases(method: string): QaCase[] {
    const verb = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? method : 'GET';
    const successStatus = verb === 'POST' ? '201' : verb === 'DELETE' ? '204 sin cuerpo' : '200';
    return [
        ['Éxito', 'Envía una petición válida.', 'Estado esperado: ' + successStatus + '. Verifica el contrato.'],
        ['Entrada inválida', 'Envía un parámetro o cuerpo inválido si la operación lo acepta.', 'Comprueba el error de validación definido en el contrato.'],
        ['Sin autorización', 'Usa un escenario de prueba sin permiso.', 'Comprueba 401 o 403 según el contrato.'],
        ['Recurso inexistente', 'Usa un identificador ficticio que no exista.', 'El consumidor muestra el resultado previsto para un 404.'],
        ['Fallo temporal', 'Simula 503 o 429 con Retry-After.', 'El consumidor maneja el error según el contrato.'],
        ['Tiempo agotado', 'Simula una respuesta que exceda el límite.', 'La petición termina y la interfaz permite recuperarse.'],
        ['Respuesta inesperada', 'Simula campos ausentes o nulos.', 'El cliente detecta la respuesta inválida sin usar datos incompletos.'],
    ].map(([scenario, steps, expected]) => ({ ...emptyCase, scenario, conditions: verb + ' · entorno de prueba', steps, expected }));
}

export type StudioDocument = {
    template: TemplateId;
    project: string;
    version: string;
    owner: string;
    fields: Record<string, string>;
    cases: QaCase[];
};

export const pending = 'Pendiente de confirmar';
export const confirmed = (value: string) => value.trim() || pending;

export const salesforceRelease: Record<string, string> = {
    'Inventario y dependencias': 'Lista los Apex, LWC, Flows y permisos que cambian. Confirma el acceso a Named Credentials y componentes requeridos en destino.',
    'Antes de liberar': 'Valida el paquete en un entorno de prueba. Ejecuta las pruebas Apex acordadas y revisa qué versión de cada Flow debe quedar activa.',
    'Verificación posterior': 'Repite el flujo principal con datos ficticios. Revisa la versión activa de Flow, Apex Jobs y el consumo autorizado del servicio externo.',
    'Reversión y aprobaciones': 'Registra la versión anterior y quién decide revertir. Evalúa por separado cambios de metadatos, activación de Flows y cambios de datos.',
};
