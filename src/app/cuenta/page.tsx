"use client";

import { FormEvent, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

function readableAuthError(error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error
        ? String(error.code)
        : '';
    if (code.includes('invalid-credential') || code.includes('wrong-password')) return 'Correo o contraseña incorrectos.';
    if (code.includes('email-already-in-use')) return 'Ya existe una cuenta con este correo.';
    if (code.includes('weak-password')) return 'La contraseña debe tener al menos 6 caracteres.';
    if (code.includes('popup-closed')) return 'La ventana de acceso se cerró antes de terminar.';
    if (code.includes('too-many-requests')) return 'Se hicieron demasiados intentos. Espera antes de continuar.';
    return 'No fue posible completar la operación. Revisa los datos e inténtalo nuevamente.';
}

export default function AccountPage() {
    const { user, loading } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setMessage('');
        if (!firebaseAuth) return;
        setPending(true);
        try {
            if (mode === 'reset') {
                await sendPasswordResetEmail(firebaseAuth, email);
                setMessage('Si la cuenta existe, recibirás un correo para restablecer la contraseña.');
            } else if (mode === 'signup') {
                const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                await updateProfile(credential.user, { displayName: displayName.trim() || undefined });
                setMessage('Cuenta creada correctamente.');
            } else {
                await signInWithEmailAndPassword(firebaseAuth, email, password);
            }
        } catch (nextError) {
            setError(readableAuthError(nextError));
        } finally {
            setPending(false);
        }
    }

    async function googleSignIn() {
        if (!firebaseAuth) return;
        setError('');
        setMessage('');
        setPending(true);
        try {
            await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
        } catch (nextError) {
            setError(readableAuthError(nextError));
        } finally {
            setPending(false);
        }
    }

    async function saveProfile() {
        if (!firebaseAuth?.currentUser) return;
        setError('');
        setPending(true);
        try {
            await updateProfile(firebaseAuth.currentUser, {
                displayName: (displayName.trim() || firebaseAuth.currentUser.displayName || '').trim(),
            });
            if (firestore) {
                await setDoc(doc(firestore, 'users', firebaseAuth.currentUser.uid), {
                    displayName: firebaseAuth.currentUser.displayName || '',
                    updatedAt: serverTimestamp(),
                }, { merge: true });
            }
            setMessage('Perfil actualizado.');
        } catch {
            setError('No fue posible actualizar el perfil.');
        } finally {
            setPending(false);
        }
    }

    if (loading) return <main className="containerx py-16"><p className="subtle">Cargando cuenta…</p></main>;
    if (!isFirebaseConfigured) return <main className="containerx py-16">
        <h1 className="page-intro text-4xl font-black">Cuenta de DevForge</h1>
        <p className="panel mt-6 p-6" role="alert">Firebase no está configurado en este entorno.</p>
    </main>;

    if (user) return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Tu cuenta</h1>
        <section className="panel mt-6 max-w-xl p-6">
            <label className="block">
                <span className="mb-2 block font-bold">Nombre visible</span>
                <input
                    className="field"
                    value={displayName || user.displayName || ''}
                    maxLength={60}
                    onChange={event => setDisplayName(event.target.value)}
                />
            </label>
            <p className="subtle mt-3 break-all">{user.email}</p>
            {message && <p role="status" className="mt-4 text-[color:var(--success)]">{message}</p>}
            {error && <p role="alert" className="mt-4 text-[color:var(--danger)]">{error}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn-primary" disabled={pending} onClick={saveProfile}>Guardar perfil</button>
                <button type="button" className="btn-secondary" onClick={() => firebaseAuth && signOut(firebaseAuth)}>Cerrar sesión</button>
            </div>
        </section>
    </main>;

    return <main className="containerx py-16">
        <h1 className="text-4xl font-black">Accede a DevForge</h1>
        <p className="subtle mt-3 max-w-2xl">Las herramientas abiertas siguen disponibles sin cuenta. El acceso permite guardar progreso y participar en funciones personales.</p>
        <section className="panel mt-6 max-w-xl p-6">
            <button type="button" className="btn-secondary w-full" disabled={pending} onClick={googleSignIn}>Continuar con Google</button>
            <div className="my-5 border-t border-[color:var(--line)]" />
            <div className="mb-5 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" aria-pressed={mode === 'login'} onClick={() => setMode('login')}>Iniciar sesión</button>
                <button type="button" className="btn-secondary" aria-pressed={mode === 'signup'} onClick={() => setMode('signup')}>Crear cuenta</button>
                <button type="button" className="btn-secondary" aria-pressed={mode === 'reset'} onClick={() => setMode('reset')}>Restablecer contraseña</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
                {mode === 'signup' && <label className="block"><span className="mb-2 block font-bold">Nombre visible</span><input className="field" value={displayName} maxLength={60} onChange={event => setDisplayName(event.target.value)} /></label>}
                <label className="block"><span className="mb-2 block font-bold">Correo</span><input className="field" type="email" autoComplete="email" value={email} required onChange={event => setEmail(event.target.value)} /></label>
                {mode !== 'reset' && <label className="block"><span className="mb-2 block font-bold">Contraseña</span><input className="field" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} value={password} required onChange={event => setPassword(event.target.value)} /></label>}
                {message && <p role="status" className="text-[color:var(--success)]">{message}</p>}
                {error && <p role="alert" className="text-[color:var(--danger)]">{error}</p>}
                <button className="btn-primary" disabled={pending} type="submit">
                    {mode === 'reset' ? 'Enviar enlace' : mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
            </form>
        </section>
    </main>;
}
