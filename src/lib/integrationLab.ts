export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Scenario = 'normal' | 'unauthorized' | 'rate-limited' | 'unavailable';
export type RecordData = { id: number; title: string; description: string };
export type InventoryItem = { sku: string; availability: string; note: string };
export type LabResponse = { status: number; body?: unknown; headers?: Record<string, string>; xml?: boolean };

export const initialRecords: RecordData[] = [
    { id: 1, title: 'Primera publicación', description: 'Registro ficticio de DevForge' },
    { id: 2, title: 'Segunda publicación', description: 'Otro registro de práctica' },
];
export const inventoryPath = '/inventory/{sku}';
const inventoryFields = ['availability', 'note'];
export const initialInventoryItem: InventoryItem = { sku: 'SKU-100', availability: 'Disponible', note: 'Taza de cerámica de ejemplo' };
export const soapNamespace = 'http://schemas.xmlsoap.org/soap/envelope/';
const calcNamespace = 'urn:devforge:calculator';
export const soapExample = '<soap:Envelope xmlns:soap="' + soapNamespace + '">\n  <soap:Body>\n    <Add xmlns="' + calcNamespace + '">\n      <a>15</a>\n      <b>25</b>\n    </Add>\n  </soap:Body>\n</soap:Envelope>';

export const operations: { method: Method; path: string; title: string; status: number; body?: string }[] = [
    { method: 'GET', path: '/posts', title: 'Listar publicaciones', status: 200 },
    { method: 'GET', path: '/posts/{id}', title: 'Consultar una publicación', status: 200 },
    { method: 'POST', path: '/posts', title: 'Crear una publicación', status: 201, body: '{"title":"Nueva publicación","description":"Creada en el laboratorio"}' },
    { method: 'PUT', path: '/posts/{id}', title: 'Reemplazar una publicación', status: 200, body: '{"title":"Título nuevo","description":"Descripción completa"}' },
    { method: 'PATCH', path: '/posts/{id}', title: 'Actualizar parte de una publicación', status: 200, body: '{"title":"Título actualizado"}' },
    { method: 'DELETE', path: '/posts/{id}', title: 'Eliminar una publicación', status: 204 },
    { method: 'GET', path: inventoryPath, title: 'Consultar un producto del inventario', status: 200 },
    { method: 'PATCH', path: inventoryPath, title: 'Actualizar disponibilidad del producto', status: 200, body: '{"availability":"Agotado","note":"Pendiente de reposición"}' },
];

export const statusLabel: Record<number, string> = {
    200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request',
    401: 'Unauthorized', 404: 'Not Found', 429: 'Too Many Requests',
    500: 'Internal Server Error', 503: 'Service Unavailable',
};

export function simulateFailure(scenario: Scenario): LabResponse | undefined {
    switch (scenario) {
        case 'normal': return undefined;
        case 'unauthorized': return { status: 401, headers: { 'WWW-Authenticate': 'Bearer' }, body: { error: 'Credencial ficticia ausente o vencida.' } };
        case 'rate-limited': return { status: 429, headers: { 'Retry-After': '15' }, body: { error: 'Límite de solicitudes simulado.' } };
        case 'unavailable': return { status: 503, body: { error: 'Servicio no disponible en esta simulación.' } };
    }
}

function parseBody(raw: string): Record<string, unknown> | undefined {
    try {
        const parsed: unknown = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : undefined;
    } catch {
        return undefined;
    }
}

function validFields(data: Record<string, unknown> | undefined, keys: string[], requireAll: boolean) {
    if (!data) return false;
    const provided = Object.keys(data);
    return provided.length > 0 && (!requireAll || keys.every(key => Object.hasOwn(data, key)))
        && provided.every(key => keys.includes(key) && typeof data[key] === 'string' && (data[key] as string).trim().length > 0);
}

export function simulateRest(operation: typeof operations[number], id: string, raw: string, records: RecordData[], nextId: number, inventoryItem: InventoryItem) {
    const result = (response: LabResponse, nextRecords = records, nextInventoryItem = inventoryItem) => ({ response, records: nextRecords, inventoryItem: nextInventoryItem });
    const bad = () => result({ status: 400, body: { error: 'Envía un objeto JSON con los campos esperados como texto no vacío.' } });
    const missing = () => result({ status: 404, body: { error: 'No existe un registro con ese identificador.' } });
    if (operation.path === inventoryPath) {
        if (inventoryItem.sku !== id) return missing();
        if (operation.method === 'GET') return result({ status: 200, body: inventoryItem });
        const data = parseBody(raw);
        if (!validFields(data, inventoryFields, false)) return bad();
        const nextInventoryItem = { ...inventoryItem, ...data };
        return result({ status: 200, body: nextInventoryItem }, records, nextInventoryItem);
    }
    if (operation.method === 'GET' && operation.path === '/posts') return result({ status: 200, body: records });
    if (operation.method === 'POST') {
        const data = parseBody(raw);
        if (!validFields(data, ['title', 'description'], true)) return bad();
        const record = { id: nextId, title: String(data?.title), description: String(data?.description) };
        return result({ status: 201, headers: { Location: '/posts/' + record.id }, body: record }, [...records, record]);
    }
    const existing = records.find(record => String(record.id) === id);
    if (!existing) return missing();
    if (operation.method === 'GET') return result({ status: 200, body: existing });
    if (operation.method === 'DELETE') return result({ status: 204 }, records.filter(record => record.id !== existing.id));
    const data = parseBody(raw);
    if (!validFields(data, ['title', 'description'], operation.method === 'PUT')) return bad();
    const record = { ...existing, ...data };
    return result({ status: 200, body: record }, records.map(item => item.id === existing.id ? record : item));
}

export function simulateSoap(raw: string): LabResponse {
    const envelope = (body: string) => '<soap:Envelope xmlns:soap="' + soapNamespace + '">\n  <soap:Body>\n    ' + body + '\n  </soap:Body>\n</soap:Envelope>';
    const fault = (message: string): LabResponse => ({ status: 500, xml: true, body: envelope('<soap:Fault><faultcode>soap:Client</faultcode><faultstring>' + message + '</faultstring></soap:Fault>') });
    if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(raw)) return fault('El ejercicio admite XML sin DTD ni declaraciones de entidades.');
    const doc = new DOMParser().parseFromString(raw, 'application/xml');
    const root = doc.documentElement;
    if (root.localName !== 'Envelope' || root.namespaceURI !== soapNamespace
        || ['http://www.mozilla.org/newlayout/xml/parsererror.xml', 'http://www.w3.org/1999/xhtml'].some(ns => doc.getElementsByTagNameNS(ns, 'parsererror').length)) {
        return fault('Se esperaba un documento SOAP 1.1 bien formado.');
    }
    const body = Array.from(root.children).find(element => element.namespaceURI === soapNamespace && element.localName === 'Body');
    const operation = body?.firstElementChild;
    if (!operation || body?.children.length !== 1 || operation.namespaceURI !== calcNamespace || operation.localName !== 'Add') {
        return fault('Operación Add o namespace incorrectos.');
    }
    const values = ['a', 'b'].map(name => Array.from(operation.children)
        .find(element => element.localName === name && element.namespaceURI === calcNamespace)?.textContent?.trim());
    if (operation.children.length !== 2 || values.some(value => !value || !/^-?\d{1,9}$/.test(value))) {
        return fault('Se esperaban dos enteros: a y b.');
    }
    const sum = Number(values[0]) + Number(values[1]);
    return { status: 200, xml: true, body: envelope('<AddResponse xmlns="' + calcNamespace + '"><AddResult>' + sum + '</AddResult></AddResponse>') };
}

export function openApiContract() {
    const paths: Record<string, Record<string, unknown>> = {};
    for (const operation of operations) {
        const inventory = operation.path === inventoryPath;
        const keys = inventory ? inventoryFields : ['title', 'description'];
        const identifier = inventory ? 'sku' : 'id';
        const properties = Object.fromEntries(keys.map(key => [key, { type: 'string', minLength: 1 }]));
        const resourceSchema = { type: 'object', properties: { [identifier]: { type: inventory ? 'string' : 'integer' }, ...properties }, required: [identifier, ...keys] };
        const parameter = inventory ? { name: 'sku', schema: { type: 'string', example: initialInventoryItem.sku } }
            : operation.path.includes('{id}') ? { name: 'id', schema: { type: 'integer', minimum: 1, example: 1 } } : undefined;
        const successSchema = operation.method === 'GET' && operation.path === '/posts' ? { type: 'array', items: resourceSchema } : resourceSchema;
        const responses: Record<string, unknown> = {
            [operation.status]: {
                description: statusLabel[operation.status],
                ...(operation.status !== 204 ? { content: { 'application/json': { schema: successSchema } } } : {}),
                ...(operation.status === 201 ? { headers: { Location: { schema: { type: 'string' } } } } : {}),
            },
            '401': { description: 'Credencial ausente o vencida' },
            '429': { description: 'Límite de solicitudes', headers: { 'Retry-After': { schema: { type: 'integer' } } } },
            '503': { description: 'Servicio indisponible' },
        };
        if (parameter) responses['404'] = { description: 'Registro inexistente' };
        if (operation.body) responses['400'] = { description: 'Cuerpo inválido' };
        (paths[operation.path] ??= {})[operation.method.toLowerCase()] = {
            summary: operation.title,
            ...(parameter ? { parameters: [{ ...parameter, in: 'path', required: true }] } : {}),
            ...(operation.body ? { requestBody: { required: true, content: { 'application/json': {
                schema: { type: 'object', properties, additionalProperties: false, minProperties: 1, ...(operation.method !== 'PATCH' ? { required: keys } : {}) },
                example: JSON.parse(operation.body),
            } } } } : {}),
            responses,
        };
    }
    return JSON.stringify({
        openapi: '3.1.0',
        info: { title: 'DevForge Integration Lab', version: '1.0.0', description: 'Contrato de prácticas locales con datos ficticios.' },
        servers: [{ url: 'https://example.invalid', description: 'Dominio reservado para el contrato de ejemplo' }],
        paths,
    }, null, 2);
}
