import React, { createContext, useContext, useState, useEffect } from 'react';

const FileSystemContext = createContext();

export const useFileSystem = () => useContext(FileSystemContext);

const initialFileSystem = {
    name: 'root',
    type: 'directory',
    children: {
        'Users': {
            name: 'Users',
            type: 'directory',
            children: {
                'User': {
                    name: 'User',
                    type: 'directory',
                    children: {
                        'Desktop': { name: 'Desktop', type: 'directory', children: {} },
                        'Documents': { name: 'Documents', type: 'directory', children: {} },
                        'Downloads': { name: 'Downloads', type: 'directory', children: {} },
                        'Pictures': { name: 'Pictures', type: 'directory', children: {} },
                        'Music': { name: 'Music', type: 'directory', children: {} },
                    }
                }
            }
        }
    }
};

export const FileSystemProvider = ({ children }) => {
    const [fs, setFs] = useState(() => {
        const saved = localStorage.getItem('macos-fs');
        return saved ? JSON.parse(saved) : initialFileSystem;
    });

    useEffect(() => {
        localStorage.setItem('macos-fs', JSON.stringify(fs));
    }, [fs]);

    // Helper to traverse path
    const getNode = (path) => {
        const parts = path.split('/').filter(p => p);
        let current = fs;
        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    };

    const mkdir = (path, name) => {
        const newFs = JSON.parse(JSON.stringify(fs)); // Deep copy
        let current = newFs;
        const parts = path.split('/').filter(p => p);

        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return false; // Path not found
            }
        }

        if (current.children[name]) return false; // Exists

        current.children[name] = {
            name,
            type: 'directory',
            children: {}
        };

        setFs(newFs);
        return true;
    };

    const touch = (path, name) => {
        const newFs = JSON.parse(JSON.stringify(fs));
        let current = newFs;
        const parts = path.split('/').filter(p => p);

        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return false;
            }
        }

        if (current.children[name]) return false;

        current.children[name] = {
            name,
            type: 'file',
            content: ''
        };

        setFs(newFs);
        return true;
    };

    return (
        <FileSystemContext.Provider value={{ fs, getNode, mkdir, touch }}>
            {children}
        </FileSystemContext.Provider>
    );
};
