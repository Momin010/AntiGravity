import { WebContainer } from '@webcontainer/api';

class WebContainerService {
    constructor() {
        this.instance = null;
        this.ready = false;
    }

    async init() {
        if (this.instance) return this.instance;

        try {
            this.instance = await WebContainer.boot();
            this.ready = true;
            console.log('WebContainer initialized');
            return this.instance;
        } catch (error) {
            console.error('Failed to initialize WebContainer:', error);
            throw error;
        }
    }

    async getInstance() {
        if (!this.instance) {
            await this.init();
        }
        return this.instance;
    }

    async executeCommand(command, args = []) {
        const instance = await this.getInstance();
        const process = await instance.spawn(command, args);

        return new Promise((resolve, reject) => {
            let output = '';
            let error = '';

            process.output.pipeTo(new WritableStream({
                write(data) {
                    output += data;
                }
            }));

            process.exit.then((exitCode) => {
                if (exitCode === 0) {
                    resolve(output);
                } else {
                    reject(new Error(error || `Command failed with exit code ${exitCode}`));
                }
            });
        });
    }

    async writeFile(path, content) {
        const instance = await this.getInstance();
        await instance.fs.writeFile(path, content);
    }

    async readFile(path) {
        const instance = await this.getInstance();
        return await instance.fs.readFile(path, 'utf-8');
    }

    async readdir(path) {
        const instance = await this.getInstance();
        return await instance.fs.readdir(path);
    }

    async mkdir(path) {
        const instance = await this.getInstance();
        await instance.fs.mkdir(path, { recursive: true });
    }

    async rm(path) {
        const instance = await this.getInstance();
        await instance.fs.rm(path, { recursive: true });
    }
}

export default new WebContainerService();
