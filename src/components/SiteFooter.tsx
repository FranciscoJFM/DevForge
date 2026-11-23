import Link from 'next/link';

const groups = [
    { title: 'Aprender', links: [['Academia', '/academia'], ['Desarrollo', '/desarrollo'], ['Videoblog', '/videoblog']] },
    { title: 'Wanchinchon', links: [['Historia', '/wanchinchon'], ['Curso', '/wanchinchon/aprender'], ['Documentación', '/wanchinchon/docs'], ['Mundos', '/wanchinchon/mundos'], ['Playground', '/wanchinchon/playground']] },
    { title: 'Construir', links: [['Herramientas', '/herramientas'], ['Proyectos', '/proyectos'], ['Microapps', '/apps']] },
    { title: 'Comunidad', links: [['Empatía Jobs', '/empleo'], ['Foro moderado', '/foro'], ['Contacto', '/contacto']] },
];

export default function SiteFooter() {
    return <footer className="site-footer">
        <div className="containerx">
            <div className="footer-grid">
                <div><Link className="brand-wordmark" href="/">Dev<span>Forge</span></Link>
                    <p className="subtle mt-3">Herramientas y práctica para desarrolladores.</p></div>
                {groups.map(group => <nav key={group.title} aria-label={group.title}>
                    <h2>{group.title}</h2>
                    {group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
                </nav>)}
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} DevForge</p>
        </div>
    </footer>;
}
