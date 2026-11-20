import QuoteDemo from '@/components/QuoteDemo';import Link from 'next/link';import {notFound} from 'next/navigation';import type {Metadata} from 'next';import {products} from '@/lib/data';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=products.find(x=>x.slug===slug);return {title:p?.name??'Microapp'}}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=products.find(x=>x.slug===slug);if(!p)notFound();return <main className="containerx py-16"><Link className="text-sm text-[color:var(--accent)]" href="/apps">← Volver al catálogo</Link><div className="grid md:grid-cols-[1fr_330px] gap-9 mt-9"><div><div className="text-6xl">{p.icon}</div><span className="pill mt-6">{p.tag}</span><h1 className="text-5xl font-black mt-5">{p.name}</h1><p className="subtle text-lg mt-5 leading-8">{p.description}</p><h2 className="text-xl font-bold mt-10">¿Qué incluye?</h2><ul className="mt-4 space-y-3">{p.features.map(f=><li key={f} className="subtle">✓ {f}</li>)}</ul><div className="panel mt-10 p-5"><b>Estado actual</b><p className="subtle mt-2 text-sm">{p.status==='demo'?'Demo disponible. La instalación, compatibilidad y entrega se acuerdan antes del pago.':'Esta microapp está en planificación; todavía no se ofrece a la venta.'}</p></div></div><aside className="panel p-7 h-fit"><p className="subtle text-sm">Precio de lanzamiento propuesto</p><p className="text-4xl font-black mt-2">${p.price} <span className="text-sm subtle">MXN</span></p><p className="subtle text-sm mt-3">Sujeto a confirmación de alcance y disponibilidad.</p><Link href={'/contacto?producto='+encodeURIComponent(p.name)} className="btn-primary w-full mt-7">{p.status==='demo'?'Solicitar compra':'Solicitar información'} →</Link>{slug==='cotizafacil'&&<Link href="#demo" className="btn-secondary w-full mt-3">Probar la demo</Link>}<p className="subtle text-xs mt-4">Sin cobro automático en esta versión.</p></aside></div>{slug==='cotizafacil'&&<>
    <section className="panel mt-8 p-6">
        <h2 className="text-xl font-bold">Qué confirmar antes de comprar</h2>
        <ul className="subtle mt-3 list-disc space-y-2 pl-5">
            <li>Instalación. Indica en qué equipo y navegador necesitas usar la microapp.</li>
            <li>Entrega y licencia. Solicita por escrito el formato de entrega y el alcance de uso antes de pagar.</li>
            <li>Soporte. Confirma qué asistencia incluye la entrega y cómo se gestionan correcciones o cambios.</li>
        </ul>
    </section>
    <QuoteDemo/>
</>}</main>}
