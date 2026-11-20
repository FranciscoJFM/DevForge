"use client";

import { useState } from 'react';

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export default function QuoteDemo() {
    const [client, setClient] = useState('Cliente de ejemplo');
    const [business, setBusiness] = useState('Mi negocio');
    const [items, setItems] = useState([{ id: 1, name: 'Servicio de ejemplo', quantity: '2', price: '500.00' }]);
    const [nextId, setNextId] = useState(2);
    const lines = items.map(item => Math.round(Number(item.price) * 100) * Number(item.quantity));
    const total = lines.reduce((sum, line) => sum + line, 0);

    return (
        <section id="demo" className="panel quote-demo mt-10 scroll-mt-24 p-6">
            <h2 className="section-title">Demo de CotizaFácil</h2>
            <p className="subtle my-4 print:hidden">Prueba con datos ficticios. El total suma cantidades por precios unitarios en MXN.</p>
            <form className="space-y-5 print:hidden" onSubmit={event => { event.preventDefault(); window.print(); }}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label>Negocio<input required className="field mt-2" maxLength={100} value={business} onChange={event => setBusiness(event.target.value)} /></label>
                    <label>Cliente<input required className="field mt-2" maxLength={100} value={client} onChange={event => setClient(event.target.value)} /></label>
                </div>
                {items.map((item, index) => (
                    <fieldset key={item.id} className="rounded-xl border border-[color:var(--input-line)] p-4">
                        <legend className="px-2">Concepto {index + 1}</legend>
                        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
                            {([['name', 'Descripción'], ['quantity', 'Cantidad'], ['price', 'Precio unitario']] as const).map(([key, label]) => (
                                <label key={key}>{label}<input required className="field mt-2" value={item[key]}
                                    type={key === 'name' ? 'text' : 'number'}
                                    min={key === 'quantity' ? 1 : 0} max={key === 'quantity' ? 9999 : 99999999}
                                    step={key === 'price' ? '0.01' : '1'} maxLength={120}
                                    onChange={event => setItems(items.map(row => row.id === item.id ? { ...row, [key]: event.target.value } : row))} /></label>
                            ))}
                            <button type="button" className="btn-secondary disabled:opacity-40" disabled={items.length === 1}
                                aria-label={'Quitar concepto ' + (index + 1)}
                                onClick={() => setItems(items.filter(row => row.id !== item.id))}>Quitar</button>
                        </div>
                    </fieldset>
                ))}
                <div className="flex flex-wrap gap-3">
                    <button type="button" className="btn-secondary" disabled={items.length >= 30} onClick={() => {
                        setItems([...items, { id: nextId, name: '', quantity: '1', price: '0' }]);
                        setNextId(nextId + 1);
                    }}>Añadir concepto</button>
                    <button type="submit" className="btn-primary">Imprimir o guardar PDF</button>
                </div>
            </form>
            <div className="mt-6">
                <h3 className="text-xl font-bold">Cotización de {business}</h3>
                <p className="mt-2">Cliente: {client}</p>
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr><th scope="col">Concepto</th><th scope="col">Cantidad</th><th scope="col">Precio unitario</th><th scope="col">Subtotal</th></tr></thead>
                        <tbody>{items.map((item, index) => (
                            <tr className="border-b border-[color:var(--input-line)]" key={item.id}><td className="py-2 pr-2">{item.name}</td><td>{item.quantity}</td><td>{money.format(Number(item.price))}</td><td>{money.format(lines[index] / 100)}</td></tr>
                        ))}</tbody>
                    </table>
                </div>
                <p className="mt-4 text-xl font-bold" aria-live="polite">Total MXN: {money.format(total / 100)}</p>
            </div>
        </section>
    );
}