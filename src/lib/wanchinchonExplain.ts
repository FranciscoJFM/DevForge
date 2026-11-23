export type WanchinchonTraceEntry = { type: string; detail?: unknown; line?: unknown; [key: string]: unknown };

export function explainWanchinchonTrace(trace: WanchinchonTraceEntry[]) {
    return trace.map(entry => {
        if (entry.type === 'event') return `Ocurrió el suceso: ${String(entry.detail ?? entry.event)}.`;
        if (entry.type === 'change') return `Cambió el estado: ${String(entry.detail)}.`;
        if (entry.type === 'condition') return `Se evaluó una condición: ${entry.detail === 'sí' ? 'la rama si se ejecutó' : 'la rama sino se ejecutó'}.`;
        if (entry.type === 'declare') return `Se declaró una variable o constante: ${String(entry.detail)}.`;
        if (entry.type === 'message') return `El programa mostró: ${String(entry.detail ?? entry.value)}.`;
        if (entry.type === 'emit') return `Se emitió el suceso: ${String(entry.detail ?? entry.event)}.`;
        if (entry.type === 'call') return `Se llamó a una función: ${String(entry.detail)}.`;
        if (entry.type === 'move') return `Se movió una entidad: ${String(entry.detail)}.`;
        return `Ejecución: ${entry.type}.`;
    });
}
