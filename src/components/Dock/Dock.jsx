import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import DockItem from './DockItem';
import './Dock.scss';

const apps = [
    { id: 'finder', name: 'Finder', icon: '/finder.png' },
    { id: 'calculator', name: 'Calculator', icon: '/calculator.png' },
    { id: 'notes', name: 'Notes', icon: '/notes.png' },
    { id: 'safari', name: 'Safari', icon: '/safari.png' },
    { id: 'terminal', name: 'Terminal', icon: '/terminal.png' },
    { id: 'xcode', name: 'Xcode', icon: '/xcode.png' },
    { id: 'settings', name: 'Settings', icon: '/settings.png' },
];

const Dock = () => {
    const mouseX = useMotionValue(null);

    return (
        <div className="dock-container">
            <motion.div
                className="dock"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(null)}
            >
                {apps.map((app) => (
                    <DockItem key={app.id} mouseX={mouseX} app={app} />
                ))}
            </motion.div>
        </div>
    );
};

export default Dock;
