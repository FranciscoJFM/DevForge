# DEVFORGE · Backlog v0.1

**Prioridades:** P0 requisito de primera demo; P1 siguiente entrega; P2 crecimiento. Estados: ✅ implementado en código; 🟡 parcial; ⬜ pendiente. Implementado no equivale a probado en producción.

| ID | Épica | Historia de usuario | Prioridad | Estado | Criterio de aceptación |
|---|---|---|---|---|---|
| DF-001 | EP01 Base técnica | Como desarrollador quiero una base Next/TS con rutas para iterar rápido | P0 | ✅ | Proyecto contiene scripts dev/build/lint/typecheck y rutas separadas |
| DF-002 | EP01 Navegación | Como visitante quiero navegar las secciones desde móvil o desktop | P0 | ✅ | Menú mobile abre/cierra, enlaces llevan a rutas existentes |
| DF-003 | EP01 Identidad | Como visitante quiero interfaz dark consistente | P0 | ✅ | Colores, tarjetas, tipografía y CTA homogéneos en páginas |
| DF-004 | EP02 Marketplace | Como cliente quiero ver las microapps y su estado | P0 | ✅ | Catálogo muestra nombre, descripción, precio propuesto y disponibilidad |
| DF-005 | EP02 Detalle | Como cliente quiero abrir ficha de producto | P0 | ✅ | Cada slug válido abre características y CTA; slug inválido da 404 |
| DF-006 | EP02 CotizaFácil | Como cliente quiero probar CotizaFácil integrado | P0 | ⬜ | Demo embebida, probada y accesible desde la ficha |
| DF-007 | EP03 Captación | Como cliente quiero preparar un mensaje de contacto | P0 | 🟡 | Formulario valida y copia mensaje; falta canal real y confirmación comercial |
| DF-008 | EP03 Ventas | Como cliente quiero conocer condiciones de adquisición | P0 | ⬜ | Página muestra alcance, entrega, licencia, soporte y términos claros |
| DF-009 | EP04 JSON | Como desarrollador quiero validar/formatear JSON | P0 | ✅ | JSON válido produce salida indentada; inválido muestra error |
| DF-010 | EP04 UUID | Como desarrollador quiero generar UUID v4 | P0 | ✅ | Se usa crypto.randomUUID bajo HTTPS/localhost y se copia |
| DF-011 | EP04 Comparador | Como desarrollador quiero detectar diferencias por línea | P0 | ✅ | Diferencias visibles y límite de 100 líneas indicado |
| DF-012 | EP05 Guías | Como estudiante quiero leer artículos completos y ejemplos | P1 | 🟡 | Fichas iniciales listas, contenido aún pendiente |
| DF-013 | EP06 PHP Security | Como desarrollador quiero checklist seguro y enlaces a guías | P1 | 🟡 | Checklist publicado; guías y referencias aún pendientes |
| DF-014 | EP06 PHP Shield | Como propietario autorizado quiero subir código para análisis aislado | P2 | ⬜ | Límites de tamaño, análisis estático, sin ejecución de código, reporte y eliminación automática |
| DF-015 | EP07 Videoblog | Como visitante quiero ver lecciones con subtítulos y voz IA | P1 | 🟡 | Página de episodios en planeación; falta video real, guion, derechos y subtítulos |
| DF-016 | EP08 Pagos | Como cliente quiero pagar por una app de forma segura | P2 | ⬜ | Backend, pago validado por webhook, recibo y licencia entregada |
| DF-017 | EP08 Autenticación | Como cliente quiero recuperar productos comprados | P2 | ⬜ | Sesiones seguras, autorización de acceso y recuperación de cuenta |
| DF-018 | EP01 QA | Como propietario quiero pruebas y despliegue reproducible | P0 | ⬜ | npm run build/lint/typecheck y pruebas de flujo completadas en CI |
| DF-019 | EP09 IA responsable | Como desarrollador quiero generar prompts verificables sin enviar datos | P1 | ✅ | El Prompt Builder permite elegir objetivo y tecnología, detecta datos sensibles básicos y copia el resultado localmente |
| DF-020 | EP10 DevForge 3.0 | Como desarrollador quiero recorrer 20 capacidades técnicas y profesionales | P1 | ✅ | El hub muestra las 20 ideas, permite filtrarlas, introducir contexto y copiar un plan local |

## Definition of Done
- Código tipado, accesible y responsive.
- Sin botones que simulen dinero, envío de formularios ni análisis reales.
- Pruebas locales ejecutadas, fallos documentados.
- Contenido y aviso de privacidad revisados antes de indexar.

## Orden de trabajo sugerido
Sprint 0 (base): DF-001 a DF-005 y DF-009 a DF-011.
Sprint 1 (ventas): DF-006, DF-007, DF-008 y DF-018.
Sprint 2 (atracción): DF-012, DF-013, DF-015.
Sprint 3+ (monetización/escáner): DF-014, DF-016 y DF-017.
