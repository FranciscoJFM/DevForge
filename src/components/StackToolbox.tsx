"use client";

import { useState } from 'react';
import { toolStacks, type ToolStack } from '@/lib/toolStacks';
import IntegrationTools from './IntegrationTools';
import DeveloperTools from './DeveloperTools';
import DocumentationGenerator from './DocumentationGenerator';
import ResourceTemplates from './ResourceTemplates';
import ToolHelp from './ToolHelp';

export default function StackToolbox() {
    const [stack, setStack] = useState<ToolStack>('apex');

    return <>
        <section className="panel mt-8 p-5" aria-labelledby="tool-stack-label">
            <label id="tool-stack-label" htmlFor="tool-stack" className="block text-lg font-bold">Tecnología de trabajo</label>
            <select id="tool-stack" className="field mt-2 max-w-xl" value={stack} onChange={event => setStack(event.target.value as ToolStack)}>
                {Object.entries(toolStacks).map(([value, technology]) => <option key={value} value={value}>{technology.label}</option>)}
            </select>
            <ToolHelp title="¿Qué cambia al elegir una tecnología?">
                <p className="subtle">Elige Android para generar un cliente con OkHttp, o Salesforce para usar Apex y preparar una consulta SOQL. La documentación y la plantilla del IDE adaptan sus ejemplos a tu elección.</p>
            </ToolHelp>
        </section>
        <IntegrationTools key={stack} stack={stack} />
        <div id="texto" className="mt-8 scroll-mt-24"><DeveloperTools /></div>
        <DocumentationGenerator stack={stack} />
        <ResourceTemplates stack={stack} />
    </>;
}
