# DEVFORGE

Centro de desarrollo para Salesforce, Android y web. Reúne proyectos de práctica, herramientas para integraciones y documentación, microapps y recursos de empleo. Está hecho con Next.js, React, TypeScript y Tailwind CSS.

## Inicio rápido

Requisitos: Node.js 20.9+ compatible con Next.js 16 (recomendado usar una versión LTS vigente) y npm.

```bash
npm install
npm run dev
```
Abrir http://localhost:3000

## Validaciones

```bash
npm run typecheck
npm run lint
npm run build
```

## Recorridos

- Desde Desarrollo puedes elegir un stack, practicar con ejemplos descargables y preparar una integración en API Studio.
- Herramientas incluye JSON, UUID, comparación de texto, SQL y SOQL, XML, SOAP y borradores Markdown. API Studio genera cURL, fetch y documentación en el navegador.
- Empatía Jobs enlaza la revisión de vacantes, Interview Lab, Portfolio y el kit de trabajo sostenible.
- CotizaFácil incluye una demo que calcula totales en MXN e imprime la cotización o permite guardarla como PDF desde el navegador.
- El buscador guarda favoritos y enlaces recientes en el navegador. Portfolio y Project Builder exportan archivos locales. El episodio de REST tiene transcripción y narración según la voz disponible en el navegador.

## Document Studio

En `/documentos` puedes editar y previsualizar una memoria técnica, un diseño funcional, un contrato de integración, un plan de liberación o una matriz QA/UAT. El Word y el Excel se generan en el navegador. El PDF se guarda desde el diálogo de impresión. Para pasar datos del expediente a una memoria, abre Document Studio desde el expediente y usa la opción de importar en la misma pestaña.

## Importante antes de publicar

### Moderación del foro

El foro usa el servidor de Next.js y guarda envíos en un directorio privado del sistema de archivos. Cuando Vercel establece `VERCEL=1`, el foro opera en modo informativo y la acción del servidor rechaza envíos hasta que se integre un backend persistente. En local se usa `.data/forum`. Para alojarlo, define `FORUM_DATA_DIR` con una ruta absoluta en un volumen privado y persistente accesible para el servidor y el moderador.

Desde la raíz de la aplicación:

```bash
node scripts/forum.mjs list
node scripts/forum.mjs approve ID
node scripts/forum.mjs archive ID
node scripts/forum.mjs published
node scripts/forum.mjs unpublish ID
```

Revisa hechos, posibles identificadores y datos sensibles antes de usar `approve`. Usa `archive` para retirar un pendiente de la cola y `unpublish` si necesitas retirar un relato público. Los archivos archivados quedan en almacenamiento privado. Antes de abrir el foro a Internet, define responsables, retención de datos y límites de solicitudes en el alojamiento.
- Configurar el dominio y definir `NEXT_PUBLIC_CONTACT_EMAIL` con la dirección pública que recibirá consultas. Para desarrollo local, colócala en `.env.local`. En producción, configúrala antes de compilar. El formulario abre el cliente de correo con el mensaje preparado y permite copiarlo cuando falta la dirección.
- Establecer condiciones comerciales, avisos de privacidad y términos.
- Conectar pasarela de pagos únicamente después de confirmar cumplimiento y seguridad.
- Revisar accesibilidad, pruebas e2e, rendimiento, dependencias, encabezados y CSP.
- El sitio se marca `noindex` hasta tener contenido terminado.

## Organización
- `src/app/` rutas y páginas
- `src/components/` componentes compartidos
- `src/lib/data.ts` catálogo tipado
- `docs/BACKLOG.md` épicas, historias, criterios y prioridad
- `docs/ARCHITECTURE.md` decisiones técnicas y evolución
