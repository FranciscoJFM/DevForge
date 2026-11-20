"use client";

import { useState } from 'react';

export default function ReviewChecklist({ title, items }: { title: string; items: string[] }) {
    const [checked, setChecked] = useState<string[]>([]);
    return <fieldset className="panel mt-8 space-y-4 p-6">
        <legend className="px-2 text-xl font-bold">{title}</legend>
        {items.map(item => <label key={item} className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={checked.includes(item)} onChange={event => {
                setChecked(current => event.target.checked ? [...current, item] : current.filter(value => value !== item));
            }} />
            {item}
        </label>)}
        <p role="status" className="subtle">{checked.length} de {items.length} puntos revisados.</p>
    </fieldset>;
}
