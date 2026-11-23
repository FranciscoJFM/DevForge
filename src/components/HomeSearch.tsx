"use client";

import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

const suggestions = ['Error 401', 'Documentar una entrega', 'SOQL', 'Agotamiento laboral', 'Pruebas Jest'];

export default function HomeSearch() {
    const [query, setQuery] = useState('');

    function submit(event: FormEvent) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('devforge-open-search', {
            detail: { query: query.trim() },
        }));
    }

    return (
        <form className="home-search" role="search" onSubmit={submit}>
            <label htmlFor="home-workspace-search" className="home-search-label">¿Qué necesitas resolver hoy?</label>
            <div className="home-search-row">
                <Search size={21} aria-hidden="true" />
                <input
                    id="home-workspace-search"
                    type="search"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Error, tecnología, herramienta o situación..."
                />
                <button type="submit" className="btn-primary">Buscar</button>
            </div>
            <div className="home-search-suggestions" aria-label="Búsquedas sugeridas">
                {suggestions.map(suggestion => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                            setQuery(suggestion);
                            window.dispatchEvent(new CustomEvent('devforge-open-search', {
                                detail: { query: suggestion },
                            }));
                        }}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </form>
    );
}
