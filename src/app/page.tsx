import Link from 'next/link';
import { BookOpen, Braces, FileCode2, GitPullRequest, HeartHandshake, ShieldCheck, Terminal, Workflow } from 'lucide-react';
import HeroWorkbench from '@/components/HeroWorkbench';

const quickLinks = [
    { name: 'Cliente HTTP', detail: 'Envía peticiones reales y lee respuestas', href: '/cliente-http', icon: Braces },
    { name: 'Integration Lab', detail: 'Practica REST, SOAP y OpenAPI', href: '/integration-lab', icon: Workflow },
    { name: 'Playground', detail: 'Escribe y prueba JavaScript', href: '/playground', icon: Terminal },
    { name: 'Documentación', detail: 'Genera Markdown y diagramas', href: '/herramientas#documentacion', icon: FileCode2 },
    { name: 'Revisión de código', detail: 'Aplica Clean Code y SOLID', href: '/revision-codigo', icon: GitPullRequest },
];

const routes = [
    ['Salesforce', 'Apex, SOQL, LWC y Flow', '/academia/salesforce'],
    ['Android', 'Kotlin, Compose y WorkManager', '/academia/android'],
    ['Web', 'JavaScript, TypeScript y React', '/academia/web-react'],
];

export default function Home() {
    return <main>
        <section className="home-hero">
            <div className="containerx home-hero-inner">
                <div>
                    <p className="hero-topic">Salesforce <span>·</span> Android <span>·</span> Web</p>
                    <h1>Del primer ejercicio <span>al código que entregas.</span></h1>
                    <p className="hero-description">Aprende un stack, prueba una integración y documenta lo que construyes. Todo desde un mismo espacio de trabajo.</p>
                    <div className="hero-actions">
                        <Link className="btn-primary" href="/herramientas"><Braces size={19} aria-hidden="true" /> Abrir herramientas</Link>
                        <Link className="btn-secondary" href="/academia"><BookOpen size={18} aria-hidden="true" /> Ver rutas de estudio</Link>
                    </div>
                </div>
                <HeroWorkbench />
            </div>
        </section>

        <section className="containerx home-section" aria-labelledby="home-tools">
            <div className="section-heading">
                <h2 id="home-tools" className="section-title">Herramientas de desarrollo</h2>
                <Link className="text-link" href="/herramientas">Ver todas</Link>
            </div>
            <div className="quick-tools">
                {quickLinks.map(({ name, detail, href, icon: Icon }) => <Link key={href} href={href} className="quick-tool">
                    <Icon size={22} aria-hidden="true" />
                    <span><strong>{name}</strong><span>{detail}</span></span>
                </Link>)}
            </div>
        </section>

        <section className="containerx home-section" aria-labelledby="home-academy">
            <div className="section-heading">
                <h2 id="home-academy" className="section-title">Elige tu próxima tecnología</h2>
                <Link className="text-link" href="/academia">Ver las 9 rutas</Link>
            </div>
            <div className="learning-board">
                {routes.map(([name, detail, href]) => <Link key={href} href={href}>
                    <span>{name}</span><span>{detail}</span><span className="learning-action">Ver ruta</span>
                </Link>)}
            </div>
        </section>

        <section className="containerx home-section home-people" aria-label="Recursos profesionales">
            <article className="home-feature">
                <HeartHandshake size={24} aria-hidden="true" />
                <h2>Empatía Jobs</h2>
                <p>Prepara tu CV, practica una entrevista y encuentra recursos para actuar ante un trato injusto.</p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/empleo" className="text-link">Recursos de empleo</Link>
                    <Link href="/trabajo-sostenible" className="text-link">Trabajo sostenible</Link>
                </div>
            </article>
            <article className="home-feature">
                <ShieldCheck size={24} aria-hidden="true" />
                <h2>Seguridad e IA</h2>
                <p>Revisa dependencias, protege los datos y aprende a integrar código generado con ayuda de IA.</p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/seguridad" className="text-link">Seguridad aplicada</Link>
                    <Link href="/ia-responsable" className="text-link">IA en el IDE</Link>
                </div>
            </article>
        </section>

        <section id="productos" className="containerx home-section" aria-labelledby="home-apps">
            <div className="microapp-feature">
                <div><h2 id="home-apps" className="section-title">CotizaFácil</h2>
                    <p>Arma una cotización en MXN, edita los conceptos y guarda el resultado como PDF.</p></div>
                <div className="flex flex-wrap gap-3">
                    <Link href="/apps/cotizafacil#demo" className="btn-primary">Probar la demo</Link>
                    <Link href="/apps" className="btn-secondary">Ver microapps</Link>
                </div>
            </div>
        </section>
    </main>;
}
