export type Product = {slug:string;name:string;tag:string;description:string;price:number;icon:string;features:string[];status:'demo'|'próximamente'};
export const products:Product[]=[
 {slug:'cotizafacil',name:'CotizaFácil',tag:'Negocios',description:'Crea cotizaciones profesionales, calcula conceptos y comparte propuestas con tus clientes.',price:399,icon:'📄',features:['Datos de cliente y negocio','Conceptos y cálculos','Impresión y guardado en PDF desde el navegador'],status:'demo'},
 {slug:'stockmini',name:'StockMini',tag:'Inventario',description:'Control simple de productos y existencias para pequeños comercios.',price:599,icon:'📦',features:['Registro de productos','Alertas de bajo inventario','Reportes básicos'],status:'próximamente'},
 {slug:'turnoflow',name:'TurnoFlow',tag:'Agenda',description:'Organiza citas para barberías, profesionales y negocios de servicios.',price:499,icon:'📅',features:['Calendario de reservas','Datos de clientes','Seguimiento de citas'],status:'próximamente'},
];
export const posts=[
 {slug:'sql-injection-php',category:'PHP · PDO',read:'6 min',title:'Evita SQL Injection con consultas preparadas',excerpt:'Una guía introductoria para evitar concatenar entradas de usuario dentro de consultas SQL.'},
 {slug:'rest-node',category:'Node.js',read:'8 min',title:'Diseña una API REST con validación desde el inicio',excerpt:'Estructura rutas, valida entradas y organiza respuestas consistentes.'},
 {slug:'apex-limites',category:'Salesforce',read:'5 min',title:'Apex: evita consultas SOQL dentro de loops',excerpt:'Patrones bulk-safe para triggers más robustos.'}
];
