export class PedidoError extends Error {
    constructor(kind, message, options = {}) {
        super(message, options);
        this.name = 'PedidoError';
        this.kind = kind;
        this.status = options.status;
    }
}

/** @typedef {{ id: number, title: string }} Pedido */

/**
 * @param {number} id
 * @param {{ fetcher?: typeof fetch, timeoutMs?: number }} [options]
 * @returns {Promise<Pedido>}
 */
export async function obtenerPedido(id, { fetcher = fetch, timeoutMs = 5000 } = {}) {
    if (!Number.isSafeInteger(id) || id < 1) {
        throw new PedidoError('input', 'El identificador debe ser un entero positivo.');
    }

    const signal = AbortSignal.timeout(timeoutMs);
    let response;
    try {
        response = await fetcher('https://jsonplaceholder.typicode.com/posts/' + id, {
            signal,
            headers: { Accept: 'application/json' },
        });
    } catch (cause) {
        if (signal.aborted) throw new PedidoError('timeout', 'El servicio tardó demasiado.', { cause });
        throw new PedidoError('network', 'No se pudo conectar con el servicio.', { cause });
    }

    if (!response.ok) {
        throw new PedidoError('http', 'La API respondió HTTP ' + response.status, { status: response.status });
    }

    let data;
    try {
        data = await response.json();
    } catch (cause) {
        if (signal.aborted) throw new PedidoError('timeout', 'El cuerpo de la respuesta tardó demasiado.', { cause });
        throw new PedidoError('json', 'El cuerpo no es JSON válido.', { cause });
    }

    if (!data || typeof data !== 'object' || !Number.isSafeInteger(data.id) || data.id !== id || typeof data.title !== 'string' || !data.title.trim()) {
        throw new PedidoError('shape', 'La respuesta no coincide con el contrato de Pedido.');
    }
    return { id: data.id, title: data.title };
}
