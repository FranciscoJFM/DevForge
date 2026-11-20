import 'server-only';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const forumDirectory = () => process.env.FORUM_DATA_DIR?.trim() || join(process.cwd(), '.data', 'forum');

export type ForumPost = {
    id: string;
    category: string;
    title: string;
    body: string;
    createdAt: string;
};

export async function saveForumPost(post: Pick<ForumPost, 'category' | 'title' | 'body'>) {
    const directory = join(forumDirectory(), 'pending');
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const entries = await readdir(directory);
    if (entries.filter(entry => entry.endsWith('.json')).length >= 200) return false;
    const id = randomUUID();
    const temporary = join(directory, id + '.tmp');
    await writeFile(temporary, JSON.stringify({ ...post, id, createdAt: new Date().toISOString() }), { flag: 'wx', mode: 0o600 });
    await rename(temporary, join(directory, id + '.json'));
    return true;
}

export async function publishedForumPosts(): Promise<ForumPost[]> {
    const directory = join(forumDirectory(), 'published');
    let files;
    try {
        files = await readdir(directory);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
        throw error;
    }
    const items = await Promise.all(files.filter(file => /^[a-f0-9-]{36}\.json$/.test(file)).map(async file => {
        try {
            return JSON.parse(await readFile(join(directory, file), 'utf8')) as ForumPost;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
            throw error;
        }
    }));
    return items.filter(item => item !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
}
