export class WanV2Error extends Error {
    line: number;
    constructor(message: string, line: number) {
        super(`Linea ${line}: ${message}`);
        this.name = 'WanV2Error';
        this.line = line;
    }
}

type Value = string | number | boolean | null | Record<string, unknown>;
type Scope = Map<string, { value: Value; fixed: boolean }>;

type Instruction =
    | { op: 'declare'; name: string; fixed: boolean; expression: string; line: number }
    | { op: 'assign'; target: string; expression: string; line: number }
    | { op: 'print'; expression: string; line: number }
    | { op: 'return'; expression: string | null; line: number }
    | { op: 'if'; expression: string; then: Instruction[]; otherwise: Instruction[]; line: number }
    | { op: 'repeat'; expression: string; body: Instruction[]; line: number }
    | { op: 'call'; expression: string; line: number }
    | { op: 'emit'; event: string; line: number };

type EntityDefinition = {
    name: string;
    traits: Record<string, { expression: string | null; type: string }>;
    constructorParams: { name: string; type: string }[];
    constructorBody: Instruction[];
    methods: Record<string, { params: { name: string; type: string }[]; returnType: string; body: Instruction[] }>;
};

export type WanV2Ast = {
    version: 2;
    name: string;
    globals: Instruction[];
    functions: Record<string, { params: { name: string; type: string }[]; returnType: string; body: Instruction[] }>;
    entities: Record<string, EntityDefinition>;
    handlers: { event: string; body: Instruction[] }[];
    initial: string[];
};

export type WanV2Result = {
    world: string;
    messages: string[];
    state: Record<string, unknown>;
    trace: { type: string; detail: string; line: number }[];
    explanation: string[];
};

function stripComment(text: string) {
    let quote = false;
    let escape = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (escape) { escape = false; continue; }
        if (char === '\\' && quote) { escape = true; continue; }
        if (char === '"') quote = !quote;
        if (char === '#' && !quote) return text.slice(0, i);
    }
    return text;
}

export function parseV2(source: string): WanV2Ast {
    const ast: WanV2Ast = { version: 2, name: '', globals: [], functions: {}, entities: {}, handlers: [], initial: [] };
    const lines = source.replace(/\r\n/g, '\n').split('\n');

    let worldDepth = 0;
    for (let i = 0; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        const line = i + 1;
        let match = text.match(/^mundo\s+([\p{L}_][\p{L}\p{N}_-]*)$/u);
        if (match) {
            if (ast.name) throw new WanV2Error('Solo puede existir un mundo raiz', line);
            ast.name = match[1];
            worldDepth = 1;
            continue;
        }
        if (text === 'fin') { worldDepth = 0; continue; }
        if (!ast.name) throw new WanV2Error('Declara primero mundo Nombre', line);

        match = text.match(/^ser\s+([\p{L}_][\p{L}\p{N}_-]*)$/u);
        if (match) {
            const entityName = match[1];
            if (ast.entities[entityName]) throw new WanV2Error(`Ser duplicado: ${entityName}`, line);
            const block = collectEntity(lines, i + 1, entityName);
            ast.entities[entityName] = block.entity;
            i = block.end;
            continue;
        }
        match = text.match(/^hacer\s+([\p{L}_][\p{L}\p{N}_-]*)\s*\((.*)\)\s*(?:->\s*(texto|numero|decimal|logico|nada|[\p{L}_][\p{L}\p{N}_-]*))?$/u);
        if (match) {
            const block = collectFunction(lines, i + 1, match[1], match[2], match[3] ?? 'nada');
            ast.functions[match[1]] = block.function;
            i = block.end;
            continue;
        }
        if (text.startsWith('ocurre ') || text.startsWith('emite ')) {
            ast.initial.push(text.replace(/^(ocurre|emite)\s+/, '').trim());
            continue;
        }
        match = text.match(/^cuando\s+(.+)$/u);
        if (match) {
            const block = splitInstructionBlock(lines, i + 1);
            ast.handlers.push({ event: match[1].trim(), body: block.body });
            i = block.end;
            continue;
        }
        if (text.startsWith('si ')) {
            const block = splitConditional(lines, i + 1, text, line);
            ast.globals.push(block.instruction);
            i = block.end;
            continue;
        }
        match = text.match(/^repite\s+(.+)\s+veces$/u);
        if (match) {
            const block = splitRepeat(lines, i + 1);
            ast.globals.push({ op: 'repeat', expression: match[1], body: block.body, line });
            i = block.end;
            continue;
        }
        ast.globals.push(parseInstruction(text, line));
    }
    if (!ast.name) throw new WanV2Error('No existe mundo', 1);
    if (worldDepth === 1 && lines.filter(item => stripComment(item).trim() === 'fin').length === 0) throw new WanV2Error('Falta fin para cerrar mundo', lines.length);
    return ast;
}

function collectEntity(lines: string[], start: number, name: string) {
    const entity: EntityDefinition = { name, traits: {}, constructorParams: [], constructorBody: [], methods: {} };
    for (let i = start; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        const line = i + 1;
        if (text === 'fin') return { entity, end: i };
        let match = text.match(/^rasgo\s+([\p{L}_][\p{L}\p{N}_-]*)(?:\s*:\s*(texto|numero|decimal|logico|nada|[\p{L}_][\p{L}\p{N}_-]*))?(?:\s*=\s*(.+))?$/u);
        if (match) {
            entity.traits[match[1]] = { expression: match[3] ?? null, type: match[2] ?? 'nada' };
            continue;
        }
        match = text.match(/^nace\s*\((.*)\)$/u);
        if (match) {
            entity.constructorParams = parseParams(match[1]);
            const block = splitInstructionBlock(lines, i + 1);
            entity.constructorBody = block.body;
            i = block.end;
            continue;
        }
        match = text.match(/^hacer\s+([\p{L}_][\p{L}\p{N}_-]*)\s*\((.*)\)\s*(?:->\s*(texto|numero|decimal|logico|nada|[\p{L}_][\p{L}\p{N}_-]*))?$/u);
        if (match) {
            const block = collectFunction(lines, i + 1, match[1], match[2], match[3] ?? 'nada');
            entity.methods[match[1]] = block.function;
            i = block.end;
            continue;
        }
        throw new WanV2Error(`Dentro de ser usa rasgo, nace o hacer: ${text}`, line);
    }
    throw new WanV2Error(`Falta fin para cerrar ser ${name}`, lines.length);
}

function collectFunction(lines: string[], start: number, name: string, paramsText: string, returnType: string) {
    const block = splitInstructionBlock(lines, start);
    return {
        end: block.end,
        function: { params: parseParams(paramsText), returnType, body: block.body },
    };
}

function splitRepeat(lines: string[], start: number) {
    const bodyLines: string[] = [];
    let depth = 1;
    for (let i = start; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (/^(si\b|repite\b)/.test(text)) depth++;
        if (text === 'fin') {
            depth--;
            if (depth === 0) return { body: parseInstructionLines(bodyLines), end: i };
            continue;
        }
        if (depth > 0) bodyLines.push(lines[i]);
    }
    throw new WanV2Error('Falta fin para cerrar repite', lines.length);
}

function splitInstructionBlock(lines: string[], start: number) {
    const body: Instruction[] = [];
    for (let i = start; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        const line = i + 1;
        if (text === 'fin') return { body, end: i };
        if (text.startsWith('si ')) {
            const block = splitConditional(lines, i + 1, text, line);
            body.push(block.instruction);
            i = block.end;
            continue;
        }
        const match = text.match(/^repite\s+(.+)\s+veces$/u);
        if (match) {
            const block = splitRepeat(lines, i + 1);
            body.push({ op: 'repeat', expression: match[1], body: block.body, line });
            i = block.end;
            continue;
        }
        body.push(parseInstruction(text, line));
    }
    throw new WanV2Error('Falta fin para cerrar el bloque', lines.length);
}

function parseInstructionLines(lines: string[]) {
    const body: Instruction[] = [];
    for (let i = 0; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        if (text.startsWith('si ')) {
            const absolute = lines.map(value => value);
            const block = splitConditional(absolute, i + 1, text, i + 1);
            body.push(block.instruction);
            i = block.end;
        } else {
            body.push(parseInstruction(text, i + 1));
        }
    }
    return body;
}

function splitConditional(lines: string[], start: number, opening: string, line: number) {
    const expression = opening.replace(/^si\s+/, '').trim();
    const thenLines: string[] = [];
    const otherwiseLines: string[] = [];
    let target = thenLines;
    let depth = 1;
    for (let i = start; i < lines.length; i++) {
        const text = stripComment(lines[i]).trim();
        if (!text) continue;
        if (/^(si\b|repite\b)/.test(text)) depth++;
        if (text === 'sino' && depth === 1) { target = otherwiseLines; continue; }
        if (text === 'fin') {
            depth--;
            if (depth === 0) return {
                instruction: { op: 'if', expression, then: parseInstructionLines(thenLines), otherwise: parseInstructionLines(otherwiseLines), line } satisfies Instruction,
                end: i,
            };
        }
        target.push(lines[i]);
    }
    throw new WanV2Error('Falta fin para cerrar si/sino', lines.length);
}

function parseParams(text: string) {
    if (!text.trim()) return [];
    return text.split(',').map(part => {
        const match = part.trim().match(/^([\p{L}_][\p{L}\p{N}_-]*)\s*:\s*(texto|numero|decimal|logico|nada|[\p{L}_][\p{L}\p{N}_-]*)$/u);
        if (!match) throw new WanV2Error(`Parametro invalido: ${part.trim()}`, 1);
        return { name: match[1], type: match[2] };
    });
}

function parseInstruction(text: string, line: number): Instruction {
    let match = text.match(/^(chon|fijo)\s+([\p{L}_][\p{L}\p{N}_-]*)(?:\s*:\s*(texto|numero|decimal|logico|nada|[\p{L}_][\p{L}\p{N}_-]*))?\s*=\s*(.+)$/u);
    if (match) return { op: 'declare', name: match[2], fixed: match[1] === 'fijo', expression: match[4], line };
    match = text.match(/^(?:cambia\s+)?([\p{L}_][\p{L}\p{N}_-]*(?:\.[\p{L}_][\p{L}\p{N}_-]*)*)\s*=\s*(.+)$/u);
    if (match) return { op: 'assign', target: match[1], expression: match[2], line };
    match = text.match(/^dice\s+(.+)$/u);
    if (match) return { op: 'print', expression: match[1], line };
    match = text.match(/^devuelve(?:\s+(.+))?$/u);
    if (match) return { op: 'return', expression: match[1] ?? null, line };
    match = text.match(/^(?:emite|ocurre)\s+(.+)$/u);
    if (match) return { op: 'emit', event: match[1].trim(), line };
    if (/^[\p{L}_][\p{L}\p{N}_-]*(?:\.[\p{L}_][\p{L}\p{N}_-]*)*(?:\s*\(.*\))?$/u.test(text)) return { op: 'call', expression: text, line };
    throw new WanV2Error(`Instruccion no valida: ${text}`, line);
}

type Token = { text: string; line: number };

function tokenizeExpression(expression: string, line: number): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < expression.length) {
        if (/\s/.test(expression[i])) { i++; continue; }
        if (expression[i] === '"') {
            let end = i + 1;
            let escape = false;
            for (; end < expression.length; end++) {
                if (escape) { escape = false; continue; }
                if (expression[end] === '\\') { escape = true; continue; }
                if (expression[end] === '"') { end++; break; }
            }
            const raw = expression.slice(i, end);
            try { JSON.parse(raw); } catch { throw new WanV2Error('Cadena invalida', line); }
            tokens.push({ text: raw, line });
            i = end;
            continue;
        }
        let match = expression.slice(i).match(/^(?:>=|<=|==|!=|\|\||&&|[+\-*/%><])/u);
        if (match) { tokens.push({ text: match[0], line }); i += match[0].length; continue; }
        if ('().,!'.includes(expression[i])) { tokens.push({ text: expression[i], line }); i++; continue; }
        match = expression.slice(i).match(/^-?(?:\d+\.\d+|\d+)/u);
        if (match) { tokens.push({ text: match[0], line }); i += match[0].length; continue; }
        match = expression.slice(i).match(/^[\p{L}_][\p{L}\p{N}_-]*/u);
        if (match) { tokens.push({ text: match[0], line }); i += match[0].length; continue; }
        throw new WanV2Error(`Token no valido: ${expression[i]}`, line);
    }
    return tokens;
}

class ExpressionParser {
    private index = 0;
    private readonly ast: WanV2Ast;
    private readonly scopes: Scope[];
    private readonly instances: Record<string, Record<string, unknown>>;
    private readonly line: number;
    private readonly trace: WanV2Result['trace'];
    private readonly messages: string[];
    private readonly callFunction: (name: string, args: Value[]) => Value;

    constructor(
        tokens: Token[],
        ast: WanV2Ast,
        scopes: Scope[],
        instances: Record<string, Record<string, unknown>>,
        line: number,
        trace: WanV2Result['trace'],
        messages: string[],
        callFunction: (name: string, args: Value[]) => Value,
    ) {
        this.tokens = tokens;
        this.ast = ast;
        this.scopes = scopes;
        this.instances = instances;
        this.line = line;
        this.trace = trace;
        this.messages = messages;
        this.callFunction = callFunction;
    }

    private readonly tokens: Token[];
    private peek(offset = 0) { return this.tokens[this.index + offset]?.text ?? ''; }
    private consume(text?: string) {
        const token = this.tokens[this.index++];
        if (!token) throw new WanV2Error('Expresion incompleta', this.line);
        if (text && token.text !== text) throw new WanV2Error(`Se esperaba ${text}`, this.line);
        return token.text;
    }

    parse(): Value {
        const value = this.parseOr();
        if (this.index !== this.tokens.length) throw new WanV2Error(`Expresion inesperada: ${this.peek()}`, this.line);
        return value;
    }

    private parseOr(): Value {
        let left = this.parseAnd();
        while (this.peek() === '||') { this.consume('||'); const right = this.parseAnd(); left = Boolean(left) || Boolean(right); }
        return left;
    }
    private parseAnd(): Value {
        let left = this.parseEquality();
        while (this.peek() === '&&') { this.consume('&&'); const right = this.parseEquality(); left = Boolean(left) && Boolean(right); }
        return left;
    }
    private parseEquality(): Value {
        let left = this.parseComparison();
        while (this.peek() === '==' || this.peek() === '!=') {
            const operator = this.consume();
            const right = this.parseComparison();
            left = operator === '==' ? left === right : left !== right;
        }
        return left;
    }
    private parseComparison(): Value {
        let left = this.parseAdd();
        while (['<', '>', '<=', '>='].includes(this.peek())) {
            const operator = this.consume();
            const right = this.parseAdd();
            if (typeof left !== 'number' || typeof right !== 'number') throw new WanV2Error('Comparacion requiere numeros', this.line);
            left = operator === '<' ? left < right : operator === '>' ? left > right : operator === '<=' ? left <= right : left >= right;
        }
        return left;
    }
    private parseAdd(): Value {
        let left = this.parseMultiply();
        while (this.peek() === '+' || this.peek() === '-') {
            const operator = this.consume();
            const right = this.parseMultiply();
            if (operator === '+' && (typeof left === 'string' || typeof right === 'string')) left = String(left) + String(right);
            else {
                if (typeof left !== 'number' || typeof right !== 'number') throw new WanV2Error('Operacion aritmetica requiere numeros', this.line);
                left = operator === '+' ? left + right : left - right;
            }
        }
        return left;
    }
    private parseMultiply(): Value {
        let left = this.parseUnary();
        while (['*', '/', '%'].includes(this.peek())) {
            const operator = this.consume();
            const right = this.parseUnary();
            if (typeof left !== 'number' || typeof right !== 'number') throw new WanV2Error('Operacion aritmetica requiere numeros', this.line);
            if (operator === '*' && typeof left === 'number' && typeof right === 'number') left = left * right;
            if (operator === '/' && typeof left === 'number' && typeof right === 'number') left = left / right;
            if (operator === '%' && typeof left === 'number' && typeof right === 'number') left = left % right;
        }
        return left;
    }
    private parseUnary(): Value {
        if (this.peek() === '-') { this.consume('-'); const value = this.parseUnary(); if (typeof value !== 'number') throw new WanV2Error('Negacion requiere numero', this.line); return -value; }
        if (this.peek() === '!') { this.consume('!'); return !Boolean(this.parseUnary()); }
        return this.parsePrimary();
    }
    private resolveName(name: string): Value {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) return this.scopes[i].get(name)!.value;
        }
        if (name === 'verdadero') return true;
        if (name === 'falso') return false;
        if (Object.hasOwn(this.instances, name)) return this.instances[name];
        throw new WanV2Error(`Nombre no definido: ${name}`, this.line);
    }
    private parsePrimary(): Value {
        if (this.peek() === '(') { this.consume('('); const value = this.parseOr(); this.consume(')'); return value; }
        if (this.peek() === 'crea') {
            this.consume('crea');
            const typeName = this.consume();
            this.consume('(');
            const args: Value[] = [];
            if (this.peek() !== ')') {
                args.push(this.parseOr());
                while (this.peek() === ',') { this.consume(','); args.push(this.parseOr()); }
            }
            this.consume(')');
            const definition = this.ast.entities[typeName];
            if (!definition) throw new WanV2Error(`Ser no definido: ${typeName}`, this.line);
            const instance: Record<string, unknown> = { __type: typeName };
            for (const [name, trait] of Object.entries(definition.traits)) {
                instance[name] = trait.expression ? this.evaluateTrait(trait.expression) : null;
            }
            this.instances[`${typeName}#${Object.keys(this.instances).length + 1}`] = instance;
            if (definition.constructorParams.length) {
                const constructorScope = new Map<string, { value: Value; fixed: boolean }>();
                definition.constructorParams.forEach((param, index) => constructorScope.set(param.name, { value: args[index] ?? null, fixed: false }));
                constructorScope.set('yo', { value: instance, fixed: true });
                this.runInstructions(definition.constructorBody, [constructorScope]);
            }
            return instance;
        }
        const token = this.consume();
        let value: Value;
        if (/^-?(?:\d+\.\d+|\d+)$/u.test(token)) value = Number(token);
        else if (token.startsWith('"')) {
            try { value = JSON.parse(token) as string; } catch { throw new WanV2Error('Cadena invalida', this.line); }
        } else if (token === 'verdadero') value = true;
        else if (token === 'falso') value = false;
        else if (this.peek() === '(') {
            this.consume('(');
            const args: Value[] = [];
            if (this.peek() !== ')') {
                args.push(this.parseOr());
                while (this.peek() === ',') { this.consume(','); args.push(this.parseOr()); }
            }
            this.consume(')');
            value = this.callFunction(token, args);
        }
        else value = this.resolveName(token);

        while (this.peek() === '.') {
            this.consume('.');
            const member = this.consume();
            if (typeof value !== 'object' || value === null) throw new WanV2Error(`No se puede acceder a ${member}`, this.line);
            if (this.peek() === '(') {
                this.consume('(');
                const args: Value[] = [];
                if (this.peek() !== ')') {
                    args.push(this.parseOr());
                    while (this.peek() === ',') { this.consume(','); args.push(this.parseOr()); }
                }
                this.consume(')');
                value = this.callObjectMethod(value as Record<string, unknown>, member, args);
            } else {
                value = (value as Record<string, unknown>)[member] as Value;
            }
        }
        if (this.peek() === '(') {
            this.consume('(');
            const args: Value[] = [];
            if (this.peek() !== ')') {
                args.push(this.parseOr());
                while (this.peek() === ',') { this.consume(','); args.push(this.parseOr()); }
            }
            this.consume(')');
            if (typeof token !== 'string') throw new WanV2Error('La llamada debe usar un nombre', this.line);
            value = this.callFunction(token, args);
        }
        return value;
    }
    private evaluateTrait(expression: string): Value {
        return new ExpressionParser(tokenizeExpression(expression, this.line), this.ast, this.scopes, this.instances, this.line, this.trace, this.messages, this.callFunction).parse();
    }
    private callObjectMethod(object: Record<string, unknown>, name: string, args: Value[]): Value {
        const typeName = String(object.__type ?? '');
        const definition = this.ast.entities[typeName];
        const method = definition?.methods[name];
        if (!method) throw new WanV2Error(`Metodo no definido: ${typeName}.${name}`, this.line);
        const scope = new Map<string, { value: Value; fixed: boolean }>();
        method.params.forEach((param, index) => scope.set(param.name, { value: args[index] ?? null, fixed: false }));
        scope.set('yo', { value: object, fixed: true });
        return this.runInstructions(method.body, [scope]);
    }
    runInstructions(instructions: Instruction[], extraScopes: Scope[] = []): Value {
        return runInstructionsInternal(instructions, this.ast, [...this.scopes, ...extraScopes], this.instances, this.trace, this.messages, this.callFunction);
    }
}

function evaluate(expression: string, line: number, ast: WanV2Ast, scopes: Scope[], instances: Record<string, Record<string, unknown>>, trace: WanV2Result['trace'], messages: string[], callFunction: (name: string, args: Value[]) => Value): Value {
    return new ExpressionParser(tokenizeExpression(expression, line), ast, scopes, instances, line, trace, messages, callFunction).parse();
}

function resolveVariable(scopes: Scope[], name: string) {
    for (let i = scopes.length - 1; i >= 0; i--) {
        if (scopes[i].has(name)) return { scope: scopes[i], entry: scopes[i].get(name)! };
    }
    return null;
}

function setTarget(scopes: Scope[], instances: Record<string, Record<string, unknown>>, target: string, value: Value, ast: WanV2Ast, trace: WanV2Result['trace'], line: number) {
    if (target.includes('.')) {
        const [entity, trait] = target.split('.');
        const resolved = resolveVariable(scopes, entity);
        let object: Record<string, unknown> | null = null;
        if (resolved?.entry.value && typeof resolved.entry.value === 'object') object = resolved.entry.value as Record<string, unknown>;
        else if (Object.hasOwn(instances, entity)) object = instances[entity];
        if (!object) throw new WanV2Error(`Ser no definido: ${entity}`, line);
        object[trait] = value;
        trace.push({ type: 'change', detail: `${target} = ${String(value)}`, line });
        return;
    }
    const resolved = resolveVariable(scopes, target);
    if (!resolved) throw new WanV2Error(`Variable no definida: ${target}`, line);
    if (resolved.entry.fixed) throw new WanV2Error(`No se puede cambiar la constante: ${target}`, line);
    resolved.entry.value = value;
    trace.push({ type: 'change', detail: `${target} = ${String(value)}`, line });
}

function runInstructionsInternal(
    instructions: Instruction[],
    ast: WanV2Ast,
    scopes: Scope[],
    instances: Record<string, Record<string, unknown>>,
    trace: WanV2Result['trace'],
    messages: string[],
    callFunction: (name: string, args: Value[]) => Value,
): Value {
    for (const instruction of instructions) {
        if (instruction.op === 'declare') {
            const scope = scopes[scopes.length - 1];
            if (!scope) throw new WanV2Error('No hay ambito disponible', instruction.line);
            if (scope.has(instruction.name)) throw new WanV2Error(`Variable duplicada: ${instruction.name}`, instruction.line);
            const value = evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
            scope.set(instruction.name, { value, fixed: instruction.fixed });
            trace.push({ type: 'declare', detail: `${instruction.fixed ? 'fijo' : 'chon'} ${instruction.name}`, line: instruction.line });
        }
        if (instruction.op === 'assign') {
            const value = evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
            setTarget(scopes, instances, instruction.target, value, ast, trace, instruction.line);
        }
        if (instruction.op === 'print') {
            const value = evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
            const message = String(value);
            messages.push(message);
            trace.push({ type: 'message', detail: message, line: instruction.line });
        }
        if (instruction.op === 'return') {
            return instruction.expression
                ? evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction)
                : null;
        }
        if (instruction.op === 'emit') {
            trace.push({ type: 'emit', detail: instruction.event, line: instruction.line });
            ast.initial.push(instruction.event);
        }
        if (instruction.op === 'repeat') {
            const count = evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
            if (typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > 100000) throw new WanV2Error('repite requiere un entero entre 0 y 100000', instruction.line);
            for (let i = 0; i < count; i++) {
                const result = runInstructionsInternal(instruction.body, ast, [...scopes, new Map()], instances, trace, messages, callFunction);
                if (result && typeof result !== 'undefined') {
                    // El return dentro de un repeater no sale de una función en esta fase experimental.
                }
            }
        }
        if (instruction.op === 'if') {
            const condition = evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
            if (typeof condition !== 'boolean') throw new WanV2Error('si requiere una expresion logica', instruction.line);
            trace.push({ type: 'condition', detail: condition ? 'sí' : 'no', line: instruction.line });
            if (condition) runInstructionsInternal(instruction.then, ast, [...scopes, new Map()], instances, trace, messages, callFunction);
            else runInstructionsInternal(instruction.otherwise, ast, [...scopes, new Map()], instances, trace, messages, callFunction);
        }
        if (instruction.op === 'call') {
            evaluate(instruction.expression, instruction.line, ast, scopes, instances, trace, messages, callFunction);
        }
    }
    return null;
}

export function runV2(ast: WanV2Ast, options: { maxEvents?: number; maxActions?: number } = {}) {
    const messages: string[] = [];
    const trace: WanV2Result['trace'] = [];
    const globalScope = new Map<string, { value: Value; fixed: boolean }>();
    const instances: Record<string, Record<string, unknown>> = {};
    let steps = 0;
    const maxActions = options.maxActions ?? 20000;

    for (const [name, definition] of Object.entries(ast.entities)) {
        const instance: Record<string, unknown> = { __type: name };
        for (const trait of Object.keys(definition.traits)) {
            instance[trait] = null;
        }
        instances[name] = instance;
        globalScope.set(name, { value: instance, fixed: true });
    }

    let callFunction: (name: string, args: Value[]) => Value = () => null;
    callFunction = (name, args) => {
        const definition = ast.functions[name];
        if (!definition) throw new WanV2Error(`Funcion no definida: ${name}`, 1);
        const scope = new Map<string, { value: Value; fixed: boolean }>();
        definition.params.forEach((param, index) => scope.set(param.name, { value: args[index] ?? null, fixed: false }));
        const before = trace.length;
        const result = runInstructionsInternal(definition.body, ast, [globalScope, scope], instances, trace, messages, callFunction);
        trace.push({ type: 'call', detail: `${name}(${args.length} argumentos)`, line: 1 });
        if (trace.length - before > maxActions) throw new WanV2Error('Limite de pasos alcanzado', 1);
        return result;
    };

    for (const [name, definition] of Object.entries(ast.entities)) {
        for (const [trait, details] of Object.entries(definition.traits)) {
            if (details.expression) {
                const instance = instances[name];
                instance[trait] = evaluate(details.expression, 1, ast, [globalScope], instances, trace, messages, callFunction);
            }
        }
    }

    runInstructionsInternal(ast.globals, ast, [globalScope], instances, trace, messages, callFunction);

    const queue = [...ast.initial];
    let processed = 0;
    const maxEvents = options.maxEvents ?? 1000;
    while (queue.length) {
        processed++;
        steps++;
        if (processed > maxEvents || steps > maxActions) throw new WanV2Error('Limite de sucesos o pasos alcanzado', 1);
        const event = queue.shift()!;
        trace.push({ type: 'event', detail: event, line: 1 });
        for (const handler of ast.handlers) {
            if (handler.event === event) runInstructionsInternal(handler.body, ast, [globalScope], instances, trace, messages, callFunction);
        }
    }

    const explanation = trace
        .filter(entry => entry.type === 'event' || entry.type === 'change' || entry.type === 'condition')
        .map(entry => entry.detail);

    return {
        world: ast.name,
        messages,
        state: { ...instances },
        trace,
        explanation,
    } satisfies WanV2Result;
}
