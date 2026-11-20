export const studyPrograms: Record<string, [string, string, string][]> = {
    "salesforce": [
        [
            "Fundamentos de plataforma",
            "Diseña cuentas, contactos y solicitudes. Define qué debe ver cada rol y por qué.",
            "Crea solicitudes ficticias para dos cuentas. Verifica relaciones y prueba la visibilidad con dos usuarios de prueba."
        ],
        [
            "Apex profesional",
            "Practica clases, colecciones, SOQL, DML y manejo de errores.",
            "Implementa un servicio de solicitudes. Prueba entradas válidas, vacías y con varias referencias."
        ],
        [
            "Triggers y Flow",
            "Determina qué regla corresponde a Flow y qué lógica se beneficia de Apex.",
            "Automatiza un cambio de estado. Repite el mismo evento de prueba y comprueba que la acción no se duplique."
        ],
        [
            "Lightning Web Components",
            "Trabaja con reactividad, eventos y Lightning Data Service.",
            "Crea una lista de solicitudes con estados de carga, vacío y error. Navega por ella con el teclado."
        ],
        [
            "Integraciones empresariales",
            "Compara REST y SOAP, credenciales configuradas, DTO y trabajos Queueable.",
            "Consume un servicio simulado. Usa HttpCalloutMock para comprobar un 200, un 404 y un error transitorio."
        ],
        [
            "Pruebas y despliegue",
            "Prepara el alcance, las dependencias y las comprobaciones de una entrega.",
            "Documenta qué metadatos van a un entorno de prueba y qué verificas antes y después de la liberación."
        ],
        [
            "Arquitectura y operación",
            "Explica decisiones, límites de plataforma, observabilidad y manejo de fallos.",
            "Dibuja el recorrido de una solicitud. Justifica cuándo es síncrona o asíncrona y cómo detectarías una falla."
        ]
    ],
    "android": [
        [
            "Kotlin y modelos",
            "Practica clases, colecciones, nulos y resultados de dominio.",
            "Modela tareas y prueba filtros con listas vacías y datos mixtos."
        ],
        [
            "Compose y accesibilidad",
            "Diseña formularios y estados que se puedan entender y recorrer.",
            "Implementa alta y edición. Prueba etiquetas, validación y rotación."
        ],
        [
            "Arquitectura y persistencia",
            "Separa UI, ViewModel y repositorio. Conserva datos con Room.",
            "Reabre la app sin red. Comprueba que los datos locales siguen disponibles."
        ],
        [
            "Red y trabajo diferido",
            "Distingue una carga interactiva de un trabajo persistente con WorkManager.",
            "Simula un fallo de conexión y verifica persistencia, mensaje y actualización posterior."
        ],
        [
            "Pruebas y entrega",
            "Combina pruebas de lógica con una prueba del flujo principal.",
            "Prepara una entrega en emulador, documenta la versión y explica cómo revertirías un cambio de esquema."
        ]
    ],
    "web-react": [
        [
            "HTML, CSS y teclado",
            "Construye una interfaz adaptable con etiquetas y foco visible.",
            "Recorre un formulario con teclado y comprueba sus mensajes en pantalla estrecha."
        ],
        [
            "TypeScript y contratos",
            "Modela los datos y valida respuestas que vienen de fuera de la aplicación.",
            "Comprueba JSON incompleto, datos vacíos y respuestas válidas."
        ],
        [
            "React y estado",
            "Separa valores de formulario, resultados remotos y estados de error.",
            "Simula respuestas con distintos tiempos y evita mostrar resultados de una consulta anterior."
        ],
        [
            "API y seguridad",
            "Ubica los secretos del lado servidor y diferencia errores de validación y red.",
            "Prueba formulario válido, respuesta 400 y error temporal sin borrar lo escrito."
        ],
        [
            "Pruebas y liberación",
            "Prepara un recorrido reproducible y una comprobación posterior al despliegue.",
            "Documenta la versión, las limitaciones y el criterio para revertir si falla la búsqueda."
        ]
    ]
};
