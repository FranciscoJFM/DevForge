"use client";

import { useState, type FormEvent } from 'react';

export default function ContactForm({ product, contactEmail }: { product: string; contactEmail: string }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [previousProduct, setPreviousProduct] = useState(product);
    const suggestedMessage = product ? `Hola, quiero información sobre ${product}.` : '';
    const [message, setMessage] = useState(suggestedMessage);
    const [status, setStatus] = useState('');

    if (product !== previousProduct) {
        setPreviousProduct(product);
        if (product) setMessage(suggestedMessage);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const body = `Nombre: ${name}\r\nCorreo: ${email}\r\n\r\n${message}`;

        if (contactEmail) {
            const subject = product ? `Consulta sobre ${product}` : 'Consulta desde DevForge';
            window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            return;
        }

        try {
            await navigator.clipboard.writeText(body);
            setStatus('Mensaje copiado.');
        } catch {
            setStatus('Selecciona y copia el contenido manualmente.');
        }
    }

    return <div className="panel p-7">
        <p className="subtle mb-6">
            {contactEmail
                ? 'Abre tu aplicación de correo con la consulta preparada y envíala desde ahí.'
                : 'Prepara tu consulta y copia el mensaje para compartirlo por el canal que prefieras.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4"><div>
                <label htmlFor="name" className="text-sm">Nombre</label>
                <input required id="name" value={name}
                    onChange={e => setName(e.target.value)}
                    className="field mt-2" placeholder="Tu nombre" maxLength={100} /></div><div>
                <label htmlFor="email" className="text-sm">Correo electrónico</label>
                <input required id="email" type="email" value={email} onChange={
                    e => setEmail(e.target.value)
                }
                    className="field mt-2" placeholder="tu@correo.com" />
            </div><div><label htmlFor="message" className="text-sm">Mensaje</label>
                <textarea required id="message" className="field mt-2 min-h-[130px]"
                    value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="¿En qué podemos ayudarte?" />
            </div>
            <button className="btn-primary" type="submit">
                {contactEmail ? 'Abrir correo' : 'Copiar mensaje'}
            </button>
            <p role="status" className="subtle text-sm">{status}</p>
        </form></div>
}
