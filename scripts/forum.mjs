import { mkdir, readdir, readFile, rename } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.env.FORUM_DATA_DIR?.trim() || join(process.cwd(), '.data', 'forum');
const [action, id] = process.argv.slice(2);

try {
    if (action === 'list' || action === 'published') {
        const directory = join(base, action === 'list' ? 'pending' : 'published');
        await mkdir(directory, { recursive: true });
        const files = (await readdir(directory)).filter(name => /^[a-f0-9-]{36}\.json$/.test(name));
        if (!files.length) console.log('Sin publicaciones en esta lista.');
        for (const file of files) {
            const post = JSON.parse(await readFile(join(directory, file), 'utf8'));
            console.log(JSON.stringify(post, null, 2));
        }
    } else if (['approve', 'archive', 'unpublish'].includes(action) && /^[a-f0-9-]{36}$/.test(id ?? '')) {
        const from = action === 'unpublish' ? 'published' : 'pending';
        const to = action === 'approve' ? 'published' : 'archived';
        await mkdir(join(base, to), { recursive: true });
        await rename(join(base, from, id + '.json'), join(base, to, id + '.json'));
        console.log(action + ': ' + id);
    } else {
        console.error('Uso: node scripts/forum.mjs list|published|approve ID|archive ID|unpublish ID');
        process.exitCode = 1;
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
