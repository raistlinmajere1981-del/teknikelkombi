import {createHash} from 'node:crypto';
import {lstatSync, readdirSync, readFileSync} from 'node:fs';
import {join, resolve, parse} from 'node:path';
export const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export function noLinks(path) {
  let cursor = resolve(path);
  while (cursor !== parse(cursor).root) {
    try {if (lstatSync(cursor).isSymbolicLink()) throw new Error('Symlink forbidden: ' + cursor);} catch (error) {if (error.code !== 'ENOENT') throw error;}
    cursor = resolve(cursor, '..');
  }
}
export function tree(root) {
  noLinks(root); const files = {};
  function visit(path, prefix='') {
    for (const item of readdirSync(path, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      const name = prefix + item.name, full = join(path,item.name);
      if (!/^[A-Za-z0-9_.-]+$/.test(item.name) || item.isSymbolicLink()) throw new Error('Unsafe asset path: ' + full);
      if (item.isDirectory()) visit(full,name+'/');
      else if (item.isFile()) files[name] = hash(full);
      else throw new Error('Non-regular file: ' + full);
    }
  }
  visit(root); return files;
}
