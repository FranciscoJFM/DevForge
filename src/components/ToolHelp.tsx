import type { ReactNode } from 'react';

export default function ToolHelp({ title = 'Ayuda y ejemplo', children }: { title?: string; children: ReactNode }) {
    return (
        <details className="mt-4 rounded-xl border border-[color:var(--input-line)] bg-[color:var(--well)] p-4">
            <summary className="w-fit cursor-pointer rounded font-semibold text-[color:var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4">
                {title}
            </summary>
            <div className="mt-3 space-y-3">{children}</div>
        </details>
    );
}

export function HelpText({ children }: { children: string }) {
    return <pre className="overflow-auto rounded-lg border border-[color:var(--line)] p-3 text-sm whitespace-pre-wrap break-words"><code>{children}</code></pre>;
}
