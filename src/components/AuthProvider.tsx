"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore, isFirebaseConfigured } from '@/lib/firebase';

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    configured: boolean;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    configured: isFirebaseConfigured,
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firebaseAuth) {
            return;
        }

        return onAuthStateChanged(firebaseAuth, async nextUser => {
            setUser(nextUser);
            setLoading(false);

            if (nextUser && firestore) {
                try {
                    const profileRef = doc(firestore, 'users', nextUser.uid);
                    const profile = await getDoc(profileRef);
                    await setDoc(doc(firestore, 'users', nextUser.uid), {
                        displayName: nextUser.displayName || '',
                        photoURL: nextUser.photoURL || '',
                        updatedAt: serverTimestamp(),
                        ...(!profile.exists() ? { createdAt: serverTimestamp() } : {}),
                    }, { merge: true });
                } catch {
                    // Authentication remains usable even if profile persistence is temporarily unavailable.
                }
            }
        });
    }, []);

    const effectiveLoading = firebaseAuth ? loading : false;
    const value = useMemo(
        () => ({ user, loading: effectiveLoading, configured: isFirebaseConfigured }),
        [user, effectiveLoading],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
