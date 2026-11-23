export class WanError extends Error {
    line: number | null;
    constructor(message: string, line: number | null = null) {
        super(line === null ? message : `Linea ${line}: ${message}`);
        this.name = 'WanError';
        this.line = line;
    }
}

export type WanExpression =
    | { kind: 'literal'; value: string | number | boolean }
    | { kind: 'reference'; value: string };

export type WanEvent = { subject: string; verb: string; object: string };
export type WanAction =
    | { op: 'set'; entity: string; trait: string; value: WanExpression; line: number }
    | { op: 'move'; entity: string; target: string; line: number }
    | { op: 'print'; value: WanExpression; line: number }
    | { op: 'emit'; event: WanEvent; line: number }
    | { op: 'if'; test: { entity: string; trait: string; operator: '==' | '!=' | '>' | '<' | '>=' | '<='; value: WanExpression }; actions: WanAction[]; line: number };

export type WanAst = {
    type: 'world';
    name: string | null;
    dictionary: Record<string, string>;
    entities: { name: string; traits: Record<string, WanExpression>; line: number }[];
    links: { from: string; relation: string; to: string; line: number }[];
    handlers: { event: WanEvent; actions: WanAction[]; line: number }[];
    initial: { event: WanEvent; line: number }[];
};

export type WanResult = {
    world: string;
    dictionary: Record<string, string>;
    state: Record<string, Record<string, string | number | boolean>>;
    links: { from: string; relation: string; to: string }[];
    messages: string[];
    trace: { type: string; [key: string]: unknown }[];
    processed: number;
};

const ID = '[\\p{L}_][\\p{L}\\p{N}_-]*';
const dotted = new RegExp(`^(${ID})\\.(${ID})$`, 'u');
const entityPattern = new RegExp(`^${ID}$`, 'u');
const eventPattern = new RegExp(`^(${ID})\\s+(${ID})\\s+(${ID})$`, 'u');
type ParseContext =
    | { kind: 'world' }
    | { kind: 'entity'; entity: WanAst['entities'][number] }
    | { kind: 'actions'; actions: WanAction[] };

function stripComment(line: string) {
    let quote = false;
    let escaped = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (escaped) { escaped = false; continue; }
        if (char === '\\' && quote) { escaped = true; continue; }
        if (char === '"') quote = !quote;
        if (char === '#' && !quote) return line.slice(0, i);
    }
    return line;
}

function literal(raw: string, line: number): WanExpression {
    const value = raw.trim();
    if (!value) throw new WanError('Falta un valor', line);
    if (value.startsWith('"')) {
        try {
            const parsed = JSON.parse(value) as unknown;
            if (typeof parsed !== 'string') throw new Error();
            return { kind: 'literal', value: parsed };
        } catch {
            throw new WanError('Cadena de texto invalida; usa comillas dobles', line);
        }
    }
    if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return { kind: 'literal', value: Number(value) };
    if (value === 'verdadero') return { kind: 'literal', value: true };
    if (value === 'falso') return { kind: 'literal', value: false };
    if (dotted.test(value)) return { kind: 'reference', value };
    if (entityPattern.test(value)) return { kind: 'literal', value };
    throw new WanError(`Expresion no valida: ${value}`, line);
}

function eventKey(expression: string, line: number | null): WanEvent {
    const match = expression.trim().match(eventPattern);
    if (!match) throw new WanError('Un suceso debe escribirse "Ser accion Objeto"', line);
    return { subject: match[1], verb: match[2], object: match[3] };
}

export function parse(source: string): WanAst {
    const ast: WanAst = { type: 'world', name: null, dictionary: {}, entities: [], links: [], handlers: [], initial: [] };
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    const stack: ParseContext[] = [];
    const current = () => stack[stack.length - 1];
    const needWorld = (line: number) => { if (!ast.name) throw new WanError('Declara primero "mundo Nombre"', line); };

    for (let i = 0; i < lines.length; i++) {
        const line = i + 1;
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        let match: RegExpMatchArray | null;

        if (text === 'fin') {
            if (!stack.length) throw new WanError('"fin" sin un bloque abierto', line);
            stack.pop();
            continue;
        }
        match = text.match(new RegExp(`^mundo\\s+(${ID})$`, 'u'));
        if (match) {
            if (ast.name || stack.length) throw new WanError('Solo puede existir un mundo raiz', line);
            ast.name = match[1];
            stack.push({ kind: 'world' });
            continue;
        }
        needWorld(line);
        const context = current();
        if (!context) throw new WanError('Contenido fuera del mundo', line);
        if (context.kind === 'world') {
            match = text.match(new RegExp(`^palabra\\s+(${ID})\\s*=\\s*(.+)$`, 'u'));
            if (match) {
                if (Object.hasOwn(ast.dictionary, match[1])) throw new WanError('Palabra repetida', line);
                const value = literal(match[2], line);
                if (value.kind !== 'literal' || typeof value.value !== 'string') throw new WanError('El significado debe ser texto', line);
                ast.dictionary[match[1]] = value.value;
                continue;
            }
            match = text.match(new RegExp(`^ser\\s+(${ID})$`, 'u'));
            if (match) {
                if (ast.entities.some(entity => entity.name === match![1])) throw new WanError(`Ser duplicado: ${match![1]}`, line);
                const entity = { name: match[1], traits: {}, line };
                ast.entities.push(entity);
                stack.push({ kind: 'entity', entity });
                continue;
            }
            match = text.match(new RegExp(`^vinculo\\s+(${ID})\\s+(${ID})\\s+(${ID})$`, 'u'));
            if (match) {
                ast.links.push({ from: match[1], relation: match[2], to: match[3], line });
                continue;
            }
            if (text.startsWith('cuando ')) {
                const handler = { event: eventKey(text.slice(7), line), actions: [] as WanAction[], line };
                ast.handlers.push(handler);
                stack.push({ kind: 'actions', actions: handler.actions });
                continue;
            }
            if (text.startsWith('ocurre ')) {
                ast.initial.push({ event: eventKey(text.slice(7), line), line });
                continue;
            }
            throw new WanError(`Instruccion no valida en el mundo: ${text}`, line);
        }
        if (context.kind === 'entity') {
            match = text.match(new RegExp(`^rasgo\\s+(${ID})\\s*=\\s*(.+)$`, 'u'));
            if (!match) throw new WanError('Dentro de un ser utiliza "rasgo nombre = valor"', line);
            if (Object.hasOwn(context.entity.traits, match[1])) throw new WanError(`Rasgo duplicado: ${match[1]}`, line);
            context.entity.traits[match[1]] = literal(match[2], line);
            continue;
        }
        if (context.kind === 'actions') {
            match = text.match(new RegExp(`^cambia\\s+(${ID})\\.(${ID})\\s*=\\s*(.+)$`, 'u'));
            if (match) { context.actions.push({ op: 'set', entity: match[1], trait: match[2], value: literal(match[3], line), line }); continue; }
            match = text.match(new RegExp(`^mueve\\s+(${ID})\\s+a\\s+(${ID})$`, 'u'));
            if (match) { context.actions.push({ op: 'move', entity: match[1], target: match[2], line }); continue; }
            match = text.match(/^dice\s+(.+)$/u);
            if (match) { context.actions.push({ op: 'print', value: literal(match[1], line), line }); continue; }
            if (text.startsWith('emite ')) { context.actions.push({ op: 'emit', event: eventKey(text.slice(6), line), line }); continue; }
            match = text.match(new RegExp(`^si\\s+(${ID})\\.(${ID})\\s*(==|!=|>=|<=|>|<)\\s*(.+)$`, 'u'));
            if (match) {
                const branch: Extract<WanAction, { op: 'if' }> = {
                    op: 'if',
                    test: { entity: match[1], trait: match[2], operator: match[3] as '==' | '!=' | '>' | '<' | '>=' | '<=', value: literal(match[4], line) },
                    actions: [],
                    line,
                };
                context.actions.push(branch);
                stack.push({ kind: 'actions', actions: branch.actions });
                continue;
            }
            throw new WanError(`Accion desconocida: ${text}`, line);
        }
    }
    if (!ast.name) throw new WanError('No existe "mundo"');
    if (stack.length) throw new WanError(`Faltan ${stack.length} "fin" para cerrar los bloques`);
    validate(ast);
    return ast;
}

function validate(ast: WanAst) {
    const beings = new Map(ast.entities.map(entity => [entity.name, entity]));
    const assertBeing = (name: string, line: number) => {
        if (!beings.has(name)) throw new WanError(`El ser "${name}" no existe`, line);
    };
    const assertTrait = (name: string, trait: string, line: number) => {
        assertBeing(name, line);
        if (!Object.hasOwn(beings.get(name)!.traits, trait)) throw new WanError(`El rasgo "${name}.${trait}" no existe`, line);
    };
    const checkValue = (value: WanExpression, line: number) => {
        if (value.kind === 'reference') {
            const [entity, trait] = value.value.split('.');
            assertTrait(entity, trait, line);
        }
    };
    const checkEvent = (event: WanEvent, line: number) => {
        assertBeing(event.subject, line);
        assertBeing(event.object, line);
    };
    for (const entity of ast.entities) for (const value of Object.values(entity.traits)) checkValue(value, entity.line);
    for (const link of ast.links) { assertBeing(link.from, link.line); assertBeing(link.to, link.line); }
    for (const handler of ast.handlers) checkEvent(handler.event, handler.line);
    for (const item of ast.initial) checkEvent(item.event, item.line);
    const checkActions = (actions: WanAction[]) => {
        for (const action of actions) {
            if (action.op === 'set') { assertTrait(action.entity, action.trait, action.line); checkValue(action.value, action.line); }
            if (action.op === 'move') { assertBeing(action.entity, action.line); assertBeing(action.target, action.line); assertTrait(action.entity, 'lugar', action.line); }
            if (action.op === 'print') checkValue(action.value, action.line);
            if (action.op === 'emit') checkEvent(action.event, action.line);
            if (action.op === 'if') { assertTrait(action.test.entity, action.test.trait, action.line); checkValue(action.test.value, action.line); checkActions(action.actions); }
        }
    };
    for (const handler of ast.handlers) checkActions(handler.actions);
}

function evalExpression(expression: WanExpression, state: Record<string, Record<string, string | number | boolean>>) {
    if (expression.kind === 'literal') return expression.value;
    const [entity, trait] = expression.value.split('.');
    return state[entity][trait];
}

function compare(left: string | number | boolean, operator: '==' | '!=' | '>' | '<' | '>=' | '<=', right: string | number | boolean) {
    if (operator === '==') return left === right;
    if (operator === '!=') return left !== right;
    if (typeof left !== typeof right || !['number', 'string'].includes(typeof left)) return false;
    if (operator === '>') return left > right;
    if (operator === '<') return left < right;
    if (operator === '>=') return left >= right;
    if (operator === '<=') return left <= right;
    return false;
}

function eventKeyValue(event: WanEvent) {
    return `${event.subject} ${event.verb} ${event.object}`;
}

export function execute(ast: WanAst, options: { maxEvents?: number; maxActions?: number; events?: string[] } = {}) {
    const maxEvents = options.maxEvents ?? 1000;
    const maxActions = options.maxActions ?? 10000;
    const state: Record<string, Record<string, string | number | boolean>> = {};
    for (const entity of ast.entities) state[entity.name] = {};
    for (const entity of ast.entities) {
        for (const [trait, value] of Object.entries(entity.traits)) state[entity.name][trait] = evalExpression(value, state);
    }
    const messages: string[] = [];
    const trace: { type: string; [key: string]: unknown }[] = [];
    const queue: WanEvent[] = options.events
        ? options.events.map(event => eventKey(event, null))
        : ast.initial.map(item => item.event);
    let operations = 0;
    let processed = 0;
    const runActions = (actions: WanAction[]) => {
        for (const action of actions) {
            operations++;
            if (operations > maxActions) throw new WanError('Limite de acciones alcanzado; posible ciclo infinito', action.line);
            if (action.op === 'set') {
                const before = state[action.entity][action.trait];
                const after = evalExpression(action.value, state);
                state[action.entity][action.trait] = after;
                trace.push({ type: 'change', entity: action.entity, trait: action.trait, before, after, line: action.line });
            }
            if (action.op === 'move') {
                const before = state[action.entity].lugar;
                state[action.entity].lugar = action.target;
                trace.push({ type: 'move', entity: action.entity, from: before, to: action.target, line: action.line });
            }
            if (action.op === 'print') {
                const message = String(evalExpression(action.value, state));
                messages.push(message);
                trace.push({ type: 'message', value: message, line: action.line });
            }
            if (action.op === 'emit') {
                queue.push(action.event);
                trace.push({ type: 'emit', event: eventKeyValue(action.event), line: action.line });
            }
            if (action.op === 'if') {
                const passed = compare(state[action.test.entity][action.test.trait], action.test.operator, evalExpression(action.test.value, state));
                trace.push({ type: 'condition', passed, line: action.line });
                if (passed) runActions(action.actions);
            }
        }
    };
    while (queue.length) {
        if (++processed > maxEvents) throw new WanError('Limite de sucesos alcanzado; posible ciclo infinito');
        const event = queue.shift()!;
        trace.push({ type: 'event', event: eventKeyValue(event) });
        for (const handler of ast.handlers) {
            if (eventKeyValue(handler.event) === eventKeyValue(event)) runActions(handler.actions);
        }
    }
    return {
        world: ast.name ?? '',
        dictionary: ast.dictionary,
        state,
        links: ast.links.map(({ from, relation, to }) => ({ from, relation, to })),
        messages,
        trace,
        processed,
    } satisfies WanResult;
}

export function run(source: string, options: { maxEvents?: number; maxActions?: number; events?: string[] } = {}) {
    const ast = parse(source);
    return { ast, result: execute(ast, options) };
}
