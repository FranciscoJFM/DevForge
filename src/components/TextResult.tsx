"use client";

import { useState } from 'react';
import { downloadText } from '@/lib/localDownload';

export default function TextResult({ value, filename, type }: { value: string; filename: string; type?: string }) {
    const [message, setMessage] = useState('');
    return (
        <div className="mt-5">
            <textarea aria-label="Resultado" className="field min-h-48 font-mono text-sm" value={value} readOnly />
            <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" className="btn-secondary" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(value);
                        setMessage('Resultado copiado.');
                    } catch {
                        setMessage('Selecciona y copia el texto manualmente.');
                    }
                }}>Copiar resultado</button>
                <button type="button" className="btn-secondary" onClick={() => downloadText(filename, value, type)}>Descargar {filename}</button>
            </div>
            <p role="status" className="subtle mt-2 text-sm">{message}</p>
        </div>
    );
}
