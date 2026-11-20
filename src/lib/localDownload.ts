export function downloadText(filename: string, value: string, type = 'text/plain') {
    downloadBlob(filename, new Blob([value], { type }));
}

export function downloadBlob(filename: string, value: Blob) {
    const url = URL.createObjectURL(value);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
