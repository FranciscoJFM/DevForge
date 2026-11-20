export const memoryFields = [
    { title: 'Objetivo y alcance', example: 'Mostrar el estado de un pedido. Esta entrega cubre la consulta. Las altas y los cambios de estado quedan fuera del alcance.' },
    { title: 'Arquitectura y componentes', example: 'Interfaz web → Servicio de pedidos → Cliente REST → API de práctica. La interfaz entrega un ID y el servicio traduce errores remotos a mensajes de la aplicación.' },
    { title: 'Contratos y datos', example: 'GET /posts/{id}. En el ejemplo, JSONPlaceholder representa al proveedor. La respuesta se reduce a id entero y title no vacío. Se registran por separado 404, 500 y respuesta inválida.' },
    { title: 'Dependencias y ambientes', example: 'Node.js 22 o superior y fetch nativo. Desarrollo usa datos ficticios. El endpoint y las variables de producción están pendientes de confirmar.' },
    { title: 'Seguridad y permisos', example: 'Validar el identificador antes de consultar. Mantener credenciales solo en el servidor si el proveedor las requiere. No registrar los cuerpos de respuesta en producción.' },
    { title: 'Observabilidad y errores', example: 'Registrar identificador de seguimiento, estado HTTP y duración. Diferenciar tiempo agotado, error de red y contrato inválido. Confirmar el umbral de alertas con Operación.' },
    { title: 'Pruebas y evidencia', example: 'Ejecutar node --test cliente-pedidos.test.mjs. Verificar 200, 404, 500, tiempo agotado, JSON inválido y contrato incompleto. Adjuntar el resultado de la ejecución de tu entorno.' },
    { title: 'Liberación y reversión', example: 'Validar el flujo principal con datos de prueba y revisar errores después de liberar. Confirmar quién detiene el despliegue y cómo se restaura una versión funcional.' },
] as const;

export const sampleMemory = '# Consulta de pedidos · ejemplo ficticio\n\n' + memoryFields.map(field => '## ' + field.title + '\n\n' + field.example).join('\n\n');
