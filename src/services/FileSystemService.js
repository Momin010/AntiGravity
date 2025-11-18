import { openDB } from 'idb';

const DB_NAME = 'macOS-VFS';
const DB_VERSION = 1;
const STORE_NAME = 'files';

class FileSystemService {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        this.db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'path' });
                    store.createIndex('parentPath', 'parentPath');
                    store.createIndex('type', 'type');
                }
            },
        });

        // Initialize root structure if empty
        const count = await this.db.count(STORE_NAME);
        if (count === 0) {
            await this.initializeFileSystem();
        }
    }

    async initializeFileSystem() {
        const initialStructure = [
            { path: '/Users', name: 'Users', type: 'directory', parentPath: '/', created: Date.now(), modified: Date.now() },
            { path: '/Users/User', name: 'User', type: 'directory', parentPath: '/Users', created: Date.now(), modified: Date.now() },
            { path: '/Users/User/Desktop', name: 'Desktop', type: 'directory', parentPath: '/Users/User', created: Date.now(), modified: Date.now() },
            { path: '/Users/User/Documents', name: 'Documents', type: 'directory', parentPath: '/Users/User', created: Date.now(), modified: Date.now() },
            { path: '/Users/User/Downloads', name: 'Downloads', type: 'directory', parentPath: '/Users/User', created: Date.now(), modified: Date.now() },
            { path: '/Users/User/Pictures', name: 'Pictures', type: 'directory', parentPath: '/Users/User', created: Date.now(), modified: Date.now() },
            { path: '/Users/User/Music', name: 'Music', type: 'directory', parentPath: '/Users/User', created: Date.now(), modified: Date.now() },
        ];

        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        for (const item of initialStructure) {
            await tx.store.put(item);
        }
        await tx.done;
    }

    async listDirectory(path) {
        if (!this.db) await this.init();
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const index = tx.store.index('parentPath');
        const items = await index.getAll(path);
        return items;
    }

    async getItem(path) {
        if (!this.db) await this.init();
        return await this.db.get(STORE_NAME, path);
    }

    async createDirectory(parentPath, name) {
        if (!this.db) await this.init();
        const path = `${parentPath === '/' ? '' : parentPath}/${name}`;

        // Check if exists
        const existing = await this.getItem(path);
        if (existing) {
            throw new Error('Directory already exists');
        }

        const item = {
            path,
            name,
            type: 'directory',
            parentPath,
            created: Date.now(),
            modified: Date.now(),
        };

        await this.db.put(STORE_NAME, item);
        return item;
    }

    async uploadFile(parentPath, file) {
        if (!this.db) await this.init();
        const path = `${parentPath === '/' ? '' : parentPath}/${file.name}`;

        // Read file content
        const content = await file.arrayBuffer();

        const item = {
            path,
            name: file.name,
            type: 'file',
            parentPath,
            size: file.size,
            mimeType: file.type,
            content,
            created: Date.now(),
            modified: Date.now(),
        };

        await this.db.put(STORE_NAME, item);
        return item;
    }

    async readFile(path) {
        if (!this.db) await this.init();
        const item = await this.getItem(path);
        if (!item || item.type !== 'file') {
            throw new Error('File not found');
        }
        return item;
    }

    async writeFile(path, content) {
        if (!this.db) await this.init();
        const item = await this.getItem(path);
        if (!item) {
            throw new Error('File not found');
        }

        item.content = content;
        item.modified = Date.now();
        await this.db.put(STORE_NAME, item);
        return item;
    }

    async deleteItem(path) {
        if (!this.db) await this.init();

        // If directory, delete all children first
        const item = await this.getItem(path);
        if (item && item.type === 'directory') {
            const children = await this.listDirectory(path);
            for (const child of children) {
                await this.deleteItem(child.path);
            }
        }

        await this.db.delete(STORE_NAME, path);
    }

    async renameItem(oldPath, newName) {
        if (!this.db) await this.init();
        const item = await this.getItem(oldPath);
        if (!item) {
            throw new Error('Item not found');
        }

        const parentPath = item.parentPath;
        const newPath = `${parentPath === '/' ? '' : parentPath}/${newName}`;

        // Delete old
        await this.deleteItem(oldPath);

        // Create new
        item.path = newPath;
        item.name = newName;
        item.modified = Date.now();
        await this.db.put(STORE_NAME, item);

        return item;
    }

    async downloadFile(path) {
        const file = await this.readFile(path);
        const blob = new Blob([file.content], { type: file.mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();

        URL.revokeObjectURL(url);
    }
}

export default new FileSystemService();
