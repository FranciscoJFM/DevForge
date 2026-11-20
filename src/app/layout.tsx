import './globals.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: { default: 'DevForge | Herramientas y rutas de desarrollo', template: '%s | DevForge' },
    description: 'Aprende Salesforce, Android y web con proyectos de práctica, herramientas de integración y recursos de carrera.',
    robots: { index: false, follow: false },
};

const themeScript = "try{if(localStorage.getItem('devforge-theme')==='light')document.documentElement.dataset.theme='light'}catch{}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang="es" data-theme="dark" suppressHydrationWarning>
        <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
        <body>
            <a href="#contenido" className="skip-link">Saltar al contenido</a>
            <SiteHeader />
            <div id="contenido" tabIndex={-1}>{children}</div>
            <SiteFooter />
        </body>
    </html>;
}
