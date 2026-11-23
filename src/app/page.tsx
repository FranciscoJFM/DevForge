import Link from 'next/link';
import { BookOpen, Braces, BriefcaseBusiness, FileCode2, GitPullRequest, HeartHandshake, ShieldCheck, Terminal, Workflow } from 'lucide-react';
import HeroWorkbench from '@/components/HeroWorkbench';
import HomeSearch from '@/components/HomeSearch';

const quickLinks = [
    { name: 'Crear un documento', detail: 'Word, PDF, Excel y Markdown', href: '/documentos', icon: FileCode2 },
    { name: 'Cliente HTTP', detail: 'Envía peticiones reales y lee respuestas', href: '/cliente-http', icon: Braces },
    { name: 'Integration Lab', detail: 'Practica REST, SOAP y OpenAPI', href: '/integration-lab', icon: Workflow },
    { name: 'Playground', detail: 'Escribe y prueba JavaScript', href: '/playground', icon: Terminal },
    { name: 'Preparar una entrega', detail: 'Lista de liberación y reversión', href: '/documentos?plantilla=liberacion', icon: GitPullRequest },
    { name: 'Resolver un error', detail: 'Diagnóstico y soluciones QuickFix', href: '/debug#quickfix', icon: GitPullRequest },
];

const entryPaths = [
    { name: 'Resuelve', detail: 'Diagnóstico guiado por problema', href: '/rescue-center', icon: ShieldCheck },
    { name: 'Aprende', detail: 'Rutas y proyectos guiados', href: '/academia', icon: BookOpen },
    { name: 'Practica', detail: 'Laboratorios, código y diagnósticos', href: '/herramientas', icon: Terminal },
    { name: 'Crece', detail: 'Inglés, carrera y trabajo sostenible', href: '/empleo', icon: BriefcaseBusiness },
    { name: 'Protégete', detail: 'Límites, acuerdos y canales de apoyo', href: '/trabajo-sostenible', icon: ShieldCheck },
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
                    <h1>Aprende. Construye. <span>Resuelve.</span></h1>
                    <p className="hero-description">Practica con problemas reales de desarrollo, comprueba tus soluciones y crece profesionalmente sin descuidar tu bienestar.</p>
                    <HomeSearch />
                    <div className="hero-actions">
                        <Link className="btn-primary" href="/rescue-center"><Braces size={19} aria-hidden="true" /> Resolver un problema</Link>
                        <Link className="btn-secondary" href="/academia"><BookOpen size={18} aria-hidden="true" /> Comenzar a aprender</Link>
                    </div>
                    <nav aria-label="Cómo empezar" className="entry-paths">
                        {entryPaths.map(({ name, detail, href, icon: Icon }) => <Link href={href} key={name}>
                            <Icon size={19} aria-hidden="true" /><strong>{name}</strong><span>{detail}</span>
                        </Link>)}
                    </nav>
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
