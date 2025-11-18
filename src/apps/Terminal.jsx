import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import './Terminal.scss';

const Terminal = () => {
    const { fs, getNode, mkdir, touch } = useFileSystem();
    const [history, setHistory] = useState(['Welcome to macOS Terminal. Type "help" for commands.']);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('/Users/User'); // Current Working Directory
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            const newHistory = [...history, `${cwd} $ ${cmd}`];

            if (cmd) {
                const args = cmd.split(' ');
                const command = args[0];

                switch (command) {
                    case 'help':
                        newHistory.push('Available commands: help, clear, ls, cd, mkdir, touch, pwd, whoami');
                        break;
                    case 'clear':
                        setHistory([]);
                        setInput('');
                        return;
                    case 'pwd':
                        newHistory.push(cwd);
                        break;
                    case 'whoami':
                        newHistory.push('User');
                        break;
                    case 'ls':
                        const node = getNode(cwd);
                        if (node && node.children) {
                            newHistory.push(Object.keys(node.children).join('  '));
                        } else {
                            newHistory.push('');
                        }
                        break;
                    case 'cd':
                        const target = args[1];
                        if (!target || target === '~') {
                            setCwd('/Users/User');
                        } else if (target === '..') {
                            const parts = cwd.split('/');
                            parts.pop();
                            setCwd(parts.join('/') || '/');
                        } else {
                            const newPath = target.startsWith('/') ? target : `${cwd === '/' ? '' : cwd}/${target}`;
                            const targetNode = getNode(newPath);
                            if (targetNode && targetNode.type === 'directory') {
                                setCwd(newPath);
                            } else {
                                newHistory.push(`cd: no such file or directory: ${target}`);
                            }
                        }
                        break;
                    case 'mkdir':
                        if (args[1]) {
                            if (mkdir(cwd, args[1])) {
                                // success
                            } else {
                                newHistory.push(`mkdir: cannot create directory '${args[1]}': File exists`);
                            }
                        } else {
                            newHistory.push('usage: mkdir directory_name');
                        }
                        break;
                    case 'touch':
                        if (args[1]) {
                            if (touch(cwd, args[1])) {
                                // success
                            } else {
                                newHistory.push(`touch: cannot create file '${args[1]}': File exists`);
                            }
                        } else {
                            newHistory.push('usage: touch file_name');
                        }
                        break;
                    default:
                        newHistory.push(`command not found: ${command}`);
                }
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <div className="terminal-app">
            <div className="history">
                {history.map((line, i) => (
                    <div key={i} className="line">{line}</div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="input-line">
                <span className="prompt">{cwd} $</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Terminal;
