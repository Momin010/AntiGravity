import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import WebContainerService from '../../services/WebContainerService';
import 'xterm/css/xterm.css';
import './Terminal.scss';

const TerminalApp = () => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#f0f0f0',
                cursor: '#30d158',
            },
        });

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize WebContainer and shell
        initializeShell(term);

        // Handle resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, []);

    const initializeShell = async (term) => {
        try {
            term.writeln('Initializing WebContainer...');
            const webcontainer = await WebContainerService.getInstance();
            term.writeln('WebContainer ready!');
            term.writeln('');

            // Start shell
            const shellProcess = await webcontainer.spawn('jsh', {
                terminal: {
                    cols: term.cols,
                    rows: term.rows,
                },
            });

            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        term.write(data);
                    },
                })
            );

            const input = shellProcess.input.getWriter();

            term.onData((data) => {
                input.write(data);
            });

            // Handle terminal resize
            term.onResize(({ cols, rows }) => {
                shellProcess.resize({ cols, rows });
            });

        } catch (error) {
            term.writeln(`Error: ${error.message}`);
            term.writeln('WebContainer is not supported in this browser.');
            term.writeln('Please use Chrome or Edge.');
        }
    };

    return (
        <div className="terminal-app-xterm">
            <div ref={terminalRef} className="terminal-container" />
        </div>
    );
};

export default TerminalApp;
