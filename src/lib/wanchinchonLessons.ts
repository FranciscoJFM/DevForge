export type WanchinchonLesson = {
    number: number;
    slug: string;
    title: string;
    summary: string;
    code: string;
    expected: string;
    explanation: string[];
};

export const wanchinchonLessons: WanchinchonLesson[] = [
    {
        number: 1,
        slug: 'hola-mundo',
        title: 'Hola, Wanchinchon',
        summary: 'Crea un mundo y muestra tu primer mensaje.',
        code: 'mundo MiPrimerMundo\n  dice "¡Hola, Wanchinchon!"\nfin',
        expected: '¡Hola, Wanchinchon!',
        explanation: ['mundo crea el entorno del programa.', 'dice muestra un mensaje.', 'fin cierra el mundo.'],
    },
    {
        number: 2,
        slug: 'datos',
        title: 'Mis primeros datos',
        summary: 'Usa variables, constantes y tipos básicos.',
        code: 'mundo Datos\n  chon nombre: texto = "Evan"\n  fijo edad: numero = 7\n  dice "Hola, " + nombre\n  dice edad\nfin',
        expected: 'Hola, Evan\n7',
        explanation: ['chon declara una variable que puede cambiar.', 'fijo declara una constante.', 'texto y numero indican el tipo esperado.'],
    },
    {
        number: 3,
        slug: 'decisiones',
        title: 'Toma decisiones',
        summary: 'Compara valores y elige una salida.',
        code: 'mundo Decisiones\n  chon edad: numero = 7\n  si edad >= 7\n    dice "Edad suficiente"\n  sino\n    dice "Edad menor"\n  fin\nfin',
        expected: 'Edad suficiente',
        explanation: ['si evalúa una condición lógica.', '>= compara que un número sea mayor o igual.', 'sino contiene la alternativa.'],
    },
    {
        number: 4,
        slug: 'repite',
        title: 'Repite acciones',
        summary: 'Ejecuta un bloque varias veces.',
        code: 'mundo Conteo\n  chon numero: numero = 1\n  repite 3 veces\n    dice numero\n    cambia numero = numero + 1\n  fin\nfin',
        expected: '1\n2\n3',
        explanation: ['repite recibe un entero.', 'El bloque se ejecuta una vez por repetición.', 'cambia actualiza una variable.'],
    },
    {
        number: 5,
        slug: 'funciones',
        title: 'Crea tus funciones',
        summary: 'Agrupa instrucciones y devuelve resultados.',
        code: 'mundo Matematicas\n  hacer doble(n: numero) -> numero\n    devuelve n * 2\n  fin\n  dice doble(6)\nfin',
        expected: '12',
        explanation: ['hacer declara una función.', 'Los parámetros reciben valores por llamada.', 'devuelve termina la función con un resultado.'],
    },
    {
        number: 6,
        slug: 'seres',
        title: 'Dale vida a un ser',
        summary: 'Define propiedades, constructor y métodos.',
        code: 'mundo Familia\n  ser Persona\n    rasgo nombre: texto = "Sin nombre"\n    rasgo edad: numero = 0\n    nace(nombre: texto, edad: numero)\n      yo.nombre = nombre\n      yo.edad = edad\n    fin\n    hacer saluda() -> texto\n      devuelve "Hola, soy " + yo.nombre\n    fin\n  fin\n  chon persona = crea Persona("Evan", 7)\n  dice persona.saluda()\nfin',
        expected: 'Hola, soy Evan',
        explanation: ['ser describe una entidad.', 'nace inicializa una entidad creada.', 'yo representa la instancia actual.'],
    },
    {
        number: 7,
        slug: 'sucesos',
        title: 'Conecta tu mundo',
        summary: 'Declara relaciones y reacciona a sucesos.',
        code: 'mundo Casa\n  ser Niño\n    rasgo feliz: logico = falso\n  fin\n  ser Wanchonchin\n  fin\n  vinculo Niño necesita Wanchonchin\n  cuando Niño pide Wanchonchin\n    cambia Niño.feliz = verdadero\n    dice "Wanchonchin listo"\n  fin\n  ocurre Niño pide Wanchonchin\nfin',
        expected: 'Wanchonchin listo',
        explanation: ['vinculo expresa una relación informativa.', 'ocurre coloca un suceso en la cola.', 'cuando registra una regla para ese suceso.'],
    },
    {
        number: 8,
        slug: 'primer-proyecto',
        title: 'Mi primer proyecto',
        summary: 'Combina datos, decisiones y funciones.',
        code: 'mundo Calculadora\n  hacer suma(a: numero, b: numero) -> numero\n    devuelve a + b\n  fin\n  fijo resultado: numero = suma(7, 5)\n  dice "Resultado: " + resultado\nfin',
        expected: 'Resultado: 12',
        explanation: ['Puedes combinar funciones y variables.', 'Las decisiones deben verificarse con el resultado visible.', 'Guarda el programa .wan para seguirlo después.'],
    },
];
