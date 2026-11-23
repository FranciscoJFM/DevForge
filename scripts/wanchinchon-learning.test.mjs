import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const file = path => readFileSync(resolve(root, path), 'utf8');

test('Learning Experience routes and worker are present', () => {
    for (const path of [
        'src/app/wanchinchon/page.tsx',
        'src/app/wanchinchon/aprender/page.tsx',
        'src/app/wanchinchon/aprender/[slug]/page.tsx',
        'src/app/wanchinchon/docs/page.tsx',
        'src/app/wanchinchon/playground/page.tsx',
        'public/wanchinchon/wan-worker.mjs',
        'public/wanchinchon/engine/core.js',
        'public/wanchinchon/engine/v2.js',
        'public/wanchinchon/engine/runtime-v2.js',
    ]) {
        assert.ok(existsSync(resolve(root, path)), path);
    }
});

test('Worker uses version selection and real engines', () => {
    const worker = file('public/wanchinchon/wan-worker.mjs');
    assert.match(worker, /parseV2\(source\)/);
    assert.match(worker, /executeV2\(/);
    assert.match(worker, /run\(source/);
    assert.match(worker, /data\?\.version==='0\.1'/);
    assert.doesNotMatch(worker, /eval\(|new Function\(/);
});

test('Playground supports execution, stop, storage and export', () => {
    const playground = file('src/components/WanchinchonWorkerPlayground.tsx');
    for (const keyword of ['new Worker', 'terminate()', 'localStorage.setItem', 'new Blob', 'URL.createObjectURL', 'trace', 'variables', '0.1', '0.2']) {
        assert.ok(playground.includes(keyword), keyword);
    }
});
