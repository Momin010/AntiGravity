import React, { useState, useEffect } from 'react';
import { FaFolder, FaFilePdf, FaFileImage, FaFile, FaFileCode, FaUpload } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward, IoTrash } from 'react-icons/io5';
import FileSystemService from '../services/FileSystemService';
import { useOS } from '../context/OSContext';
import './Finder.scss';

const Finder = () => {
    const { openWindow } = useOS();
    const [currentPath, setCurrentPath] = useState('/Users/User/Desktop');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDirectory(currentPath);
    }, [currentPath]);

    const loadDirectory = async (path) => {
        setLoading(true);
        try {
            const items = await FileSystemService.listDirectory(path);
            setFiles(items);
        } catch (error) {
            console.error('Failed to load directory:', error);
        }
        setLoading(false);
    };

    const navigateTo = (name) => {
        const newPath = `${currentPath}/${name}`;
        setCurrentPath(newPath);
    };

    const goBack = () => {
        const parts = currentPath.split('/').filter(p => p);
        if (parts.length > 1) {
            parts.pop();
            setCurrentPath('/' + parts.join('/'));
        }
    };

    const handleFileUpload = async (e) => {
        const uploadedFiles = Array.from(e.target.files);
        for (const file of uploadedFiles) {
            try {
                await FileSystemService.uploadFile(currentPath, file);
            } catch (error) {
                console.error('Failed to upload file:', error);
            }
        }
        loadDirectory(currentPath);
    };

    const handleCreateFolder = async () => {
        const name = prompt('Enter folder name:');
        if (name) {
            try {
                await FileSystemService.createDirectory(currentPath, name);
                loadDirectory(currentPath);
            } catch (error) {
                alert('Failed to create folder: ' + error.message);
            }
        }
    };

    const handleDelete = async (e, file) => {
        e.stopPropagation();
        if (confirm(`Delete ${file.name}?`)) {
            try {
                await FileSystemService.deleteItem(file.path);
                loadDirectory(currentPath);
            } catch (error) {
                alert('Failed to delete: ' + error.message);
            }
        }
    };

    const handleDoubleClick = async (file) => {
        if (file.type === 'directory') {
            navigateTo(file.name);
        } else {
            // Open file based on type
            const ext = file.name.split('.').pop().toLowerCase();
            const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'json', 'html', 'css', 'scss', 'md', 'txt'];

            if (codeExts.includes(ext)) {
                openWindow('xcode', 'Xcode', { filePath: file.path });
            } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
                // Could open in Preview app
                alert('Image preview coming soon!');
            } else if (ext === 'pdf') {
                alert('PDF preview coming soon!');
            } else {
                // Download
                await FileSystemService.downloadFile(file.path);
            }
        }
    };

    const getIcon = (file) => {
        if (file.type === 'directory') return <FaFolder className="folder" />;

        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'pdf') return <FaFilePdf className="pdf" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return <FaFileImage className="image" />;
        if (['js', 'jsx', 'ts', 'tsx', 'py', 'json', 'html', 'css', 'scss'].includes(ext)) return <FaFileCode className="code" />;

        return <FaFile />;
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="finder-app">
            <div className="sidebar">
                <div className="section">
                    <div className="header">Favorites</div>
                    <div className="item" onClick={() => setCurrentPath('/Users/User/Desktop')}>Desktop</div>
                    <div className="item" onClick={() => setCurrentPath('/Users/User/Documents')}>Documents</div>
                    <div className="item" onClick={() => setCurrentPath('/Users/User/Downloads')}>Downloads</div>
                    <div className="item" onClick={() => setCurrentPath('/Users/User/Pictures')}>Pictures</div>
                    <div className="item" onClick={() => setCurrentPath('/Users/User/Music')}>Music</div>
                </div>
            </div>

            <div className="main-view">
                <div className="toolbar">
                    <div className="nav-buttons">
                        <button onClick={goBack}><IoChevronBack /></button>
                        <button><IoChevronForward /></button>
                    </div>
                    <div className="path">{currentPath.split('/').pop() || 'Root'}</div>
                    <div className="actions">
                        <label className="upload-btn">
                            <FaUpload />
                            <span>Upload</span>
                            <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                        <button onClick={handleCreateFolder}>New Folder</button>
                    </div>
                </div>

                <div className="files-grid">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : files.length === 0 ? (
                        <div className="empty">This folder is empty</div>
                    ) : (
                        files.map(file => (
                            <div
                                key={file.path}
                                className="file-item"
                                onDoubleClick={() => handleDoubleClick(file)}
                            >
                                <div className="icon">{getIcon(file)}</div>
                                <div className="name">{file.name}</div>
                                {file.size && <div className="size">{formatSize(file.size)}</div>}
                                <button className="delete-btn" onClick={(e) => handleDelete(e, file)}>
                                    <IoTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Finder;
