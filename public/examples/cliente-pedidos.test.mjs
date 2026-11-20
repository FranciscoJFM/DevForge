import assert from 'node:assert/strict';
import { test } from 'node:test';
import { obtenerPedido, PedidoError } from './cliente-pedidos.mjs';

const response = (body, status = 200) => async () => new Response(body, { status });
const failure = (kind, status) => error => error instanceof PedidoError
    && error.kind === kind && error.status === status;

test('acepta un pedido válido y solo devuelve los campos del contrato', async () => {
    const pedido = await obtenerPedido(1, { fetcher: response('{"id":1,"title":"Pedido demo","body":"Extra"}') });
    assert.deepEqual(pedido, { id: 1, title: 'Pedido demo' });
});

for (const status of [404, 500]) {
    test('conserva HTTP ' + status, async () => {
        await assert.rejects(obtenerPedido(1, { fetcher: response('{}', status) }), failure('http', status));
    });
}

test('distingue la respuesta sin título', async () => {
    await assert.rejects(obtenerPedido(1, { fetcher: response('{"id":1}') }), failure('shape'));
});

test('distingue JSON inválido', async () => {
    await assert.rejects(obtenerPedido(1, { fetcher: response('{"id":') }), failure('json'));
});

test('distingue fallos de red', async () => {
    const fetcher = async () => { throw Error('Red de prueba no disponible'); };
    await assert.rejects(obtenerPedido(1, { fetcher }), failure('network'));
});

test('cancela la espera cuando se agota el tiempo', async () => {
    const keepAlive = setTimeout(() => {}, 1000);
    try {
        const fetcher = (_, { signal }) => new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        });
        await assert.rejects(obtenerPedido(1, { timeoutMs: 10, fetcher }), failure('timeout'));
    } finally {
        clearTimeout(keepAlive);
    }
});

test('rechaza identificadores inválidos antes de solicitar datos', async () => {
    await assert.rejects(obtenerPedido(0), failure('input'));
});
