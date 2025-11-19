import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import FileSystemService from '../services/FileSystemService';
import './Xcode.scss';

const Xcode = ({ filePath }) => {
    const editorRef = useRef(null);
    const [currentFile, setCurrentFile] = React.useState(null);
    const [content, setContent] = React.useState('');
    const [language, setLanguage] = React.useState('javascript');

    React.useEffect(() => {
        if (filePath) {
            loadFile(filePath);
        }
    }, [filePath]);

    const loadFile = async (path) => {
        try {
            const file = await FileSystemService.readFile(path);
            const decoder = new TextDecoder();
            const text = decoder.decode(file.content);
            setContent(text);
            setCurrentFile(file);

            // Detect language from extension
            const ext = file.name.split('.').pop();
            const langMap = {
                'js': 'javascript',
                'jsx': 'javascript',
                'ts': 'typescript',
                'tsx': 'typescript',
                'py': 'python',
                'json': 'json',
                'html': 'html',
                'css': 'css',
                'scss': 'scss',
                'md': 'markdown',
            };
            setLanguage(langMap[ext] || 'plaintext');
        } catch (error) {
            console.error('Failed to load file:', error);
        }
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleSave = async () => {
        if (!currentFile) return;

        try {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(content);
            await FileSystemService.writeFile(currentFile.path, encoded.buffer);
            console.log('File saved!');
        } catch (error) {
            console.error('Failed to save file:', error);
        }
    };

    // Handle Cmd+S / Ctrl+S
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [content, currentFile]);

    return (
        <div className="xcode-app">
            <div className="toolbar">
                <div className="file-name">{currentFile?.name || 'Untitled'}</div>
                <button onClick={handleSave} className="save-btn">Save (⌘S)</button>
            </div>
            <Editor
                height="100%"
                language={language}
                value={content}
                onChange={(value) => setContent(value || '')}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default Xcode;
