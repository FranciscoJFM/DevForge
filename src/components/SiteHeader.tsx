"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Menu } from 'lucide-react';
import { useRef } from 'react';
import ResourceSearch from '@/components/ResourceSearch';
import ThemeToggle from '@/components/ThemeToggle';

const links = [
    { href: '/desarrollo', label: 'Desarrollo', related: ['/proyectos', '/trayectoria'] },
    { href: '/academia', label: 'Academia', related: ['/videoblog', '/ingles', '/retos'] },
    { href: '/herramientas', label: 'Herramientas', related: ['/api-studio', '/integration-lab', '/debug', '/ejemplos', '/git', '/revision-codigo', '/playground', '/project-builder', '/cliente-http', '/ide', '/expediente'] },
    { href: '/apps', label: 'Microapps', related: [] },
    { href: '/empleo', label: 'Empleo', related: ['/analizar-vacante', '/guia-empleo', '/entrevistas', '/portafolio', '/foro', '/trabajo-sostenible'] },
    { href: '/seguridad', label: 'Seguridad e IA', related: ['/ia-responsable'] },
];

export default function SiteHeader() {
    const pathname = usePathname();
    const menu = useRef<HTMLDetailsElement>(null);
    const menuButton = useRef<HTMLElement>(null);

    function navigation(closeMenu = false) {
        return links.map(({ href, label, related }) => (
            <Link className="site-nav-link" key={href} href={href} aria-current={pathname === href ? 'page' : undefined}
                data-active={[href, ...related].some(path => pathname === path || pathname.startsWith(path + '/'))}
                onClick={closeMenu ? () => { if (menu.current) menu.current.open = false; } : undefined}>{label}</Link>
        ));
    }

    return <header className="site-header">
        <div className="containerx header-row">
            <Link href="/" className="brand-wordmark" aria-label="DevForge, inicio">
                <span className="brand-icon"><Code2 size={20} aria-hidden="true" /></span>
                <span>Dev<span>Forge</span></span>
            </Link>
            <nav aria-label="Principal" className="desktop-nav">{navigation()}</nav>
            <div className="header-actions">
                <ResourceSearch />
                <ThemeToggle />
                <details className="mobile-menu" ref={menu} onKeyDown={event => {
                    if (event.key === 'Escape' && menu.current?.open) {
                        menu.current.open = false;
                        menuButton.current?.focus();
                    }
                }}>
                    <summary ref={menuButton} aria-label="Menú" className="btn-secondary text-sm"><Menu size={17} aria-hidden="true" /> <span className="compact-control-label">Menú</span></summary>
                    <nav aria-label="Menú móvil">{navigation(true)}</nav>
                </details>
            </div>
        </div>
    </header>;
}
