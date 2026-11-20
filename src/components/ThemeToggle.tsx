"use client";

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const storageKey = 'devforge-theme';
const changeEvent = 'devforge-theme-change';

function readTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function subscribe(update: () => void) {
    function fromOtherTab(event: StorageEvent) {
        if (event.key !== storageKey && event.key !== null) return;
        document.documentElement.dataset.theme = event.newValue === 'light' ? 'light' : 'dark';
        update();
    }
    window.addEventListener('storage', fromOtherTab);
    window.addEventListener(changeEvent, update);
    return () => {
        window.removeEventListener('storage', fromOtherTab);
        window.removeEventListener(changeEvent, update);
    };
}

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark');
    const light = theme === 'light';
    const label = light ? 'Activar tema nocturno' : 'Activar tema claro';

    return <button type="button" className="btn-secondary theme-toggle" aria-label={label} title={label} onClick={() => {
        const next = light ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(storageKey, next); } catch { /* The current page still updates. */ }
        window.dispatchEvent(new Event(changeEvent));
    }}>{light ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}</button>;
}
