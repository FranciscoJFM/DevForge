"use server";

import { forumCategories } from '@/lib/forumCategories';
import { forumAcceptsSubmissions, saveForumPost } from '@/lib/forum';

export async function submitForumPost(_previous: { message: string; success: boolean }, form: FormData) {
    if (!forumAcceptsSubmissions()) return { message: 'El foro aún no recibe envíos en este alojamiento.', success: false };
    const category = String(form.get('category') ?? '');
    const title = String(form.get('title') ?? '').trim();
    const body = String(form.get('body') ?? '').trim();
    const fail = (message: string) => ({ message, success: false });
    if (!forumCategories.some(item => item === category) || title.length < 5 || title.length > 100
        || body.length < 25 || body.length > 2000 || form.get('review') !== 'on') {
        return fail('Completa todos los campos y confirma la revisión de privacidad.');
    }
    const personalData = /[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:\/\/|(?:\+\d{1,3}[\s-]?)?(?:\d[\s().-]*){10,}/i;
    if (personalData.test(title + '\n' + body)) {
        return fail('Retira enlaces, correos y posibles teléfonos antes de enviar.');
    }
    try {
        if (!await saveForumPost({ category, title, body })) return fail('La cola de revisión está llena. Intenta más tarde.');
        return { message: 'Enviado para revisión. Aparecerá en el foro si el equipo de moderación lo aprueba.', success: true };
    } catch {
        return fail('No se pudo guardar el envío. Conserva tu borrador e intenta de nuevo.');
    }
}
