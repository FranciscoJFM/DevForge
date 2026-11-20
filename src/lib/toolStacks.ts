export const toolStacks = {
    apex: { label: 'Salesforce · Apex', classExample: 'apex-clase', requirement: 'Org de pruebas, permisos de Apex y Named Credential para callouts.', verification: 'Pruebas Apex con HttpCalloutMock y casos con varios registros.' },
    kotlin: { label: 'Android · Kotlin', classExample: 'kotlin-clase', requirement: 'Módulo Android, configuración de Gradle, permiso INTERNET y OkHttp.', verification: 'Prueba sin conexión, respuestas HTTP y cambios de estado en pantalla.' },
    fetch: { label: 'Web · JavaScript y TypeScript', classExample: 'ts-clase', requirement: 'Entorno JavaScript, configuración del endpoint y credenciales en el servidor si se requieren.', verification: 'Prueba carga, respuesta vacía, error HTTP y navegación con teclado.' },
    java: { label: 'Java', classExample: 'java-clase', requirement: 'JDK 11 o superior para HttpClient y configuración de Maven o Gradle.', verification: 'Prueba tiempo de espera, errores HTTP y deserialización de la respuesta.' },
    swift: { label: 'iOS · Swift', classExample: 'swift-clase', requirement: 'Proyecto Xcode, URLSession y configuración HTTPS del servicio.', verification: 'Prueba la vista en simulador con éxito, red lenta y error.' },
    python: { label: 'Python y Django', classExample: 'python-clase', requirement: 'Entorno virtual y dependencias del proyecto. El cliente HTTP usa requests.', verification: 'Simula respuestas HTTP en pruebas y verifica la validación del formulario.' },
    ruby: { label: 'Ruby y Rails', classExample: 'ruby-clase', requirement: 'Versión de Ruby de tu proyecto, Bundler y Net::HTTP para el cliente.', verification: 'Prueba respuestas del servicio sin conexiones reales y revisa errores en el formulario.' },
} as const;

export type ToolStack = keyof typeof toolStacks;
