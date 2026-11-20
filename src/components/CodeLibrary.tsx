"use client";

import { useState } from 'react';
import { examples } from '@/lib/codeExamples';
import TextResult from './TextResult';

const stacks = [...new Set(examples.map(example => example.stack))];

export default function CodeLibrary() {
    const [stack, setStack] = useState(stacks[0]);
    const [id, setId] = useState(examples[0].id);
    const [name, setName] = useState('');
    const choices = examples.filter(example => example.stack === stack);
    const example = choices.find(item => item.id === id) ?? choices[0];
    const validName = !name || /^[A-Z][A-Za-z0-9]{0,47}$/.test(name);
    const symbol = 'symbol' in example ? example.symbol : undefined;
    const code = symbol && name && validName ? example.code.replaceAll(symbol, name) : example.code;
    const filename = symbol && name && validName ? example.file.endsWith('.py') || example.file.endsWith('.rb')
        ? name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase() + example.file.slice(example.file.lastIndexOf('.'))
        : example.file.replace(symbol, name) : example.file;

    return (
        <div className="panel mt-8 p-6">
            <div className="grid gap-4 md:grid-cols-2">
                <label>Tecnología<select className="field mt-2" value={stack} onChange={event => {
                    setStack(event.target.value);
                    setName('');
                }}>{stacks.map(item => <option key={item}>{item}</option>)}</select></label>
                <label>Ejemplo<select className="field mt-2" value={example.id} onChange={event => {
                    setId(event.target.value);
                    setName('');
                }}>{choices.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
            </div>
            <h2 className="mt-5 text-xl font-bold">{example.title}</h2>
            <p className="subtle mt-2 leading-7">{example.tip}</p>
            {symbol && <label className="mt-4 block">Nombre para generar (opcional)
                <input className="field mt-2" value={name} maxLength={48} placeholder={symbol} onChange={event => setName(event.target.value)} />
            </label>}
            {!validName && <p role="alert" className="mt-3 text-red-200">Empieza con mayúscula y usa solo letras ASCII y números.</p>}
            {validName && <TextResult key={example.id} value={code} filename={filename} />}
        </div>
    );
}
