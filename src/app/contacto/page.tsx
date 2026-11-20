import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = { title: 'Contacto' };

export default async function Contact({ searchParams }: { searchParams: Promise<{ producto?: string }> }) {
    const { producto } = await searchParams;
    const product = typeof producto === 'string' ? producto.trim().slice(0, 100) : '';
    const configured = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? '';
    const contactEmail = /^[^\s?&@]+@[^\s?&@]+\.[^\s?&@]+$/.test(configured) ? configured : '';

    return <main className="containerx max-w-3xl py-12 md:py-16">
        <header className="page-intro mb-6">
            <h1>Contacto</h1>
            <p>Pregunta por una microapp o cuéntanos qué necesitas resolver.</p>
        </header>
        {contactEmail && <a className="btn-secondary mb-5" href={'mailto:' + contactEmail}>Escribir directamente por correo</a>}
        <noscript><p className="panel mb-5 p-4">Con JavaScript desactivado, prepara tu consulta con tu nombre, correo y una descripción de lo que necesitas.</p></noscript>
        <ContactForm product={product} contactEmail={contactEmail} />
    </main>;
}
