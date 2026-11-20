import { confirmed, qaColumns, studioTemplates, type StudioDocument } from './documentStudio';

const excelMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function studioMarkdown(document: StudioDocument) {
    const { template, project, version, owner, fields, cases } = document;
    const metadata = '# ' + studioTemplates[template].title + '\n\nProyecto: ' + confirmed(project)
        + '\n\nVersión: ' + confirmed(version) + '\n\nResponsable: ' + confirmed(owner);
    if (template !== 'qa') {
        return metadata + '\n\n' + studioTemplates[template].fields.map(field =>
            '## ' + field.title + '\n\n' + confirmed(fields[field.title] ?? '')
        ).join('\n\n') + '\n';
    }
    return metadata + '\n\n' + cases.map((row, index) => '## Caso ' + (index + 1) + '\n\n'
        + qaColumns.map(([key, label]) => '**' + label + '**\n\n' + confirmed(row[key])).join('\n\n')).join('\n\n') + '\n';
}

export async function studioWord(data: StudioDocument) {
    const { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType } = await import('docx');
    const template = studioTemplates[data.template];
    const paragraph = (text: string) => new Paragraph({
        spacing: { after: 110 },
        children: text.split('\n').map((line, index) => new TextRun({ text: line, break: index ? 1 : 0 })),
    });
    const heading = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 210, after: 100 } });
    const versionTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({ tableHeader: true, children: ['Versión', 'Responsable'].map(text =>
                new TableCell({ shading: { fill: 'E2F1E8' }, children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })] })) }),
            new TableRow({ children: [confirmed(data.version), confirmed(data.owner)].map(text => new TableCell({ children: [paragraph(text)] })) }),
        ],
    });
    const contents = data.template === 'qa'
        ? data.cases.flatMap((row, index) => [
            heading('Caso ' + (index + 1) + ' · ' + confirmed(row.scenario)),
            ...qaColumns.slice(1).map(([key, label]) => paragraph(label + ': ' + confirmed(row[key]))),
        ])
        : template.fields.flatMap(field => [heading(field.title), paragraph(confirmed(data.fields[field.title] ?? ''))]);

    const word = new Document({
        creator: 'DevForge',
        title: template.title + ' · ' + confirmed(data.project),
        features: { updateFields: true },
        styles: { default: { document: { run: { font: 'Calibri', size: 22, color: '182D26' } } } },
        sections: [
            { children: [
                new Paragraph({ text: template.title, heading: HeadingLevel.TITLE, spacing: { before: 1400, after: 300 } }),
                paragraph('Proyecto: ' + confirmed(data.project)),
                paragraph('Control de versiones'),
                versionTable,
            ] },
            { children: [
                new Paragraph({ text: 'Índice', spacing: { after: 120 }, children: [] }),
                new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-1' }),
                ...contents,
            ] },
        ],
    });
    return Packer.toBlob(word);
}

export async function studioExcel(data: StudioDocument) {
    const { Workbook } = await import('exceljs');
    const workbook = new Workbook();
    workbook.creator = 'DevForge';
    const sheet = workbook.addWorksheet('Matriz QA', { views: [{ state: 'frozen', ySplit: 1 }] });
    sheet.columns = qaColumns.map(([key, header], index) => ({ key, header, width: index === 2 || index === 3 ? 46 : 25 }));
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF146043' } };
    sheet.getRow(1).height = 23;
    sheet.autoFilter = { from: 'A1', to: 'I' + Math.max(2, data.cases.length + 1) };
    for (const entry of data.cases) {
        const row = sheet.addRow(Object.fromEntries(qaColumns.map(([key]) => [key, confirmed(entry[key])])));
        row.alignment = { vertical: 'top', wrapText: true };
    }
    const summary = workbook.addWorksheet('Proyecto');
    summary.columns = [{ width: 24 }, { width: 48 }];
    summary.addRows([['Proyecto', confirmed(data.project)], ['Versión', confirmed(data.version)], ['Responsable', confirmed(data.owner)]]);
    const bytes = await workbook.xlsx.writeBuffer();
    return new Blob([Uint8Array.from(new Uint8Array(bytes))], { type: excelMime });
}
