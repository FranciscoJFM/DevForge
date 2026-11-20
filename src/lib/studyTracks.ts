export const studyTracks = [
    {
        "slug": "salesforce",
        "name": "Salesforce",
        "stack": "Apex · SOQL · LWC · Flow",
        "project": "Directorio de casos con Apex, LWC y una acción Flow.",
        "resource": {
            "title": "Salesforce Certified Platform Developer",
            "href": "https://trailhead.salesforce.com/credentials/platformdeveloperi",
            "note": "Revisa la guía del examen y prepara ejemplos de Apex, pruebas, interfaces y despliegue. Después puedes explorar Platform Developer II.",
            "kind": "Certificación"
        },
        "steps": [
            {
                "title": "Datos y SOQL",
                "exercise": "Modela cuentas y casos. Consulta el estado y la cuenta asociada en SOQL.",
                "check": "Comprueba que una consulta filtrada devuelva solo los casos abiertos de tus datos ficticios."
            },
            {
                "title": "Apex y pruebas",
                "exercise": "Crea un servicio que reciba varios IDs de cuenta y regrese los casos agrupados.",
                "check": "Escribe pruebas para una cuenta, varias y una lista vacía. Mantén SOQL fuera del bucle."
            },
            {
                "title": "LWC, Flow e integraciones",
                "exercise": "Muestra casos en Lightning y crea una acción invocable que normalice referencias.",
                "check": "Prueba que Flow reciba una salida por entrada. Simula un error HTTP con HttpCalloutMock."
            }
        ]
    },
    {
        "slug": "android",
        "name": "Android",
        "stack": "Kotlin · Jetpack Compose",
        "project": "App de tareas con búsqueda, persistencia local y actualización en segundo plano.",
        "resource": {
            "title": "Android Basics with Compose",
            "href": "https://developer.android.com/courses/android-basics-compose/course",
            "note": "Curso oficial de Google. Acompáñalo con una demo en emulador y pruebas para mostrar tus habilidades.",
            "kind": "Formación y evidencia"
        },
        "steps": [
            {
                "title": "Fundamentos de Kotlin",
                "exercise": "Crea una clase Tarea y escribe funciones para filtrar tareas activas.",
                "check": "Prueba una lista vacía, una lista mixta y un título con acentos."
            },
            {
                "title": "Compose y estado",
                "exercise": "Crea un formulario y una lista. Mueve el estado de pantalla a un ViewModel cuando crezca el flujo.",
                "check": "Comprueba la validación y conserva los datos al girar el dispositivo."
            },
            {
                "title": "Datos y trabajo en segundo plano",
                "exercise": "Guarda las tareas con Room y usa WorkManager para una actualización diferida.",
                "check": "Simula falta de red y comprueba que puedes seguir consultando las tareas locales."
            }
        ]
    },
    {
        "slug": "web-react",
        "name": "Web y React",
        "stack": "HTML · CSS · JavaScript · TypeScript · React",
        "project": "Buscador accesible que consulta un catálogo con estados de carga, vacío y error.",
        "resource": {
            "title": "React Learn",
            "href": "https://react.dev/learn",
            "note": "Usa la documentación oficial para estudiar. Presenta un enlace a la demo, pruebas y un README como evidencia.",
            "kind": "Formación y evidencia"
        },
        "steps": [
            {
                "title": "HTML, CSS y accesibilidad",
                "exercise": "Construye un formulario con etiquetas asociadas, mensajes de error y diseño adaptable.",
                "check": "Completa el formulario usando solo teclado y comprueba el diseño en una pantalla estrecha."
            },
            {
                "title": "JavaScript y TypeScript",
                "exercise": "Consume un JSON de prueba, tipa sus datos y filtra el catálogo.",
                "check": "Prueba respuestas vacías y datos con formato inesperado."
            },
            {
                "title": "React y solicitudes",
                "exercise": "Implementa una búsqueda con estados visibles y cancela solicitudes obsoletas.",
                "check": "Usa respuestas con distintas demoras para verificar que siempre se muestran los resultados más recientes."
            }
        ]
    },
    {
        "slug": "java",
        "name": "Java",
        "stack": "Java · JUnit · Spring Boot",
        "project": "API de inventario con validación, persistencia y pruebas.",
        "resource": {
            "title": "Oracle Certified Professional: Java SE 21 Developer",
            "href": "https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course",
            "note": "La credencial evalúa Java SE. Complementa tu práctica con un repositorio Spring Boot para demostrar el framework.",
            "kind": "Certificación"
        },
        "steps": [
            {
                "title": "Clases y colecciones",
                "exercise": "Modela productos y construye un inventario con un mapa por identificador.",
                "check": "Añade pruebas para crear, buscar y rechazar identificadores duplicados."
            },
            {
                "title": "API con Spring Boot",
                "exercise": "Crea endpoints para listar y registrar productos y valida los datos de entrada.",
                "check": "Comprueba que una creación válida devuelva 201 y que una cantidad negativa devuelva 400."
            },
            {
                "title": "Persistencia y verificación",
                "exercise": "Guarda los productos en una base de pruebas y documenta el contrato.",
                "check": "Prueba una creación seguida de una lectura y verifica que ambas devuelvan el mismo identificador."
            }
        ]
    },
    {
        "slug": "ios",
        "name": "iOS",
        "stack": "Swift · SwiftUI · XCTest",
        "project": "App de hábitos que filtra, edita y conserva los registros al reiniciar.",
        "resource": {
            "title": "App Development with Swift",
            "href": "https://certiport.pearsonvue.com/Educator-resources/Exam-details/Objective-domains/App-Development-with-Swift-Objective-Domain-Crossw.pdf",
            "note": "Consulta el temario de Certiport y confirma la disponibilidad en tu centro antes de planear el examen.",
            "kind": "Certificación"
        },
        "steps": [
            {
                "title": "Swift y modelos",
                "exercise": "Define un modelo de hábito con fecha y estado, y crea un método para cambiar el estado.",
                "check": "Verifica el valor inicial y que el cambio de estado no afecte otros hábitos."
            },
            {
                "title": "SwiftUI y navegación",
                "exercise": "Construye una lista con una pantalla de edición y validación del nombre.",
                "check": "Prueba que al cancelar salgas sin cambiar el registro."
            },
            {
                "title": "Persistencia y pruebas",
                "exercise": "Guarda los hábitos con una estrategia local y prueba el manejo de errores.",
                "check": "Reabre la app en el simulador y comprueba que los registros siguen disponibles."
            }
        ]
    },
    {
        "slug": "django",
        "name": "Python y Django",
        "stack": "Python · Django · ORM",
        "project": "Tablero de incidencias con autenticación, permisos y pruebas de solicitudes.",
        "resource": {
            "title": "Tutorial oficial de Django",
            "href": "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
            "note": "Sigue el tutorial y usa como evidencia un repositorio que incluya pruebas de permisos y migraciones reproducibles.",
            "kind": "Formación y evidencia"
        },
        "steps": [
            {
                "title": "Python y modelos",
                "exercise": "Modela incidencias y crea una migración para guardar título, estado y responsable.",
                "check": "Ejecuta la migración en una base vacía y crea una incidencia desde los datos de prueba."
            },
            {
                "title": "Vistas y formularios",
                "exercise": "Añade una vista que reciba un formulario y guarde una incidencia válida.",
                "check": "Prueba que una entrada inválida muestre el error y no cree registros."
            },
            {
                "title": "Autenticación y permisos",
                "exercise": "Restringe la edición al responsable según una regla explícita.",
                "check": "Crea dos usuarios de prueba. Verifica que uno pueda editar y que el otro no pueda hacerlo."
            }
        ]
    },
    {
        "slug": "ruby-rails",
        "name": "Ruby y Rails",
        "stack": "Ruby · Rails · Active Record",
        "project": "Catálogo con formularios, validación y pruebas de solicitudes.",
        "resource": {
            "title": "Ruby Association Certified Ruby Programmer",
            "href": "https://www.ruby.or.jp/en/certification/examination/",
            "note": "Empieza por Silver para Ruby. Usa tu proyecto Rails para demostrar rutas, modelos y pruebas del framework.",
            "kind": "Certificación"
        },
        "steps": [
            {
                "title": "Ruby y pruebas",
                "exercise": "Modela un producto y calcula el total de una lista de cantidades y precios.",
                "check": "Prueba lista vacía y cantidades límite. Representa el dinero con unidades enteras o decimales precisos."
            },
            {
                "title": "Rutas, modelos y formularios",
                "exercise": "Construye el alta de un producto con Active Record y valida campos requeridos.",
                "check": "Comprueba que un campo vacío muestre un error sin guardar el producto."
            },
            {
                "title": "Consultas y pruebas de solicitudes",
                "exercise": "Añade filtros y un caso de prueba para cada resultado importante.",
                "check": "Verifica la respuesta cuando hay coincidencias y cuando el catálogo está vacío."
            }
        ]
    },
    {
        "slug": "node",
        "name": "Node.js",
        "stack": "JavaScript · Node.js · APIs",
        "project": "API de notas con validación, paginación y pruebas HTTP.",
        "resource": {
            "title": "Node.js Learn",
            "href": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
            "note": "Estudia con Node.js Learn y muestra un contrato OpenAPI y pruebas en tu repo como evidencia.",
            "kind": "Formación y evidencia"
        },
        "steps": [
            {
                "title": "Runtime y asincronía",
                "exercise": "Crea un comando que lea un JSON y lo convierta en un resumen.",
                "check": "Prueba archivo inexistente y JSON inválido con mensajes claros."
            },
            {
                "title": "API y errores",
                "exercise": "Implementa una API para crear y listar notas. Define los formatos de entrada y error.",
                "check": "Envía JSON válido e inválido y verifica los códigos 201 y 400."
            },
            {
                "title": "Paginación y documentación",
                "exercise": "Añade paginación y documenta dos páginas en OpenAPI.",
                "check": "Comprueba que al recorrer páginas no se repitan elementos con datos fijos."
            }
        ]
    },
    {
        "slug": "php",
        "name": "PHP",
        "stack": "PHP · PDO · PHPUnit",
        "project": "Catálogo con formulario, consultas parametrizadas y pruebas.",
        "resource": {
            "title": "Manual oficial de PHP",
            "href": "https://www.php.net/manual/en/tutorial.php",
            "note": "Empieza con el manual y publica un ejemplo pequeño que demuestre validación, consultas parametrizadas y pruebas.",
            "kind": "Formación y evidencia"
        },
        "steps": [
            {
                "title": "Formularios y salida",
                "exercise": "Construye un formulario que valide nombres y muestre mensajes junto al campo.",
                "check": "Comprueba espacios, acentos y caracteres que deben mostrarse como texto."
            },
            {
                "title": "Persistencia con PDO",
                "exercise": "Crea un catálogo y filtra registros con sentencias preparadas.",
                "check": "Verifica que los parámetros se envían separados de la consulta y que las búsquedas correctas devuelven resultados."
            },
            {
                "title": "Pruebas y entrega",
                "exercise": "Separa la validación de la vista y añade pruebas con PHPUnit.",
                "check": "Incluye instrucciones para preparar una base de pruebas y ejecutar los casos desde un entorno limpio."
            }
        ]
    }
];
