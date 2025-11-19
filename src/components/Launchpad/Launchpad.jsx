import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useOS } from '../../context/OSContext';
import './Launchpad.scss';

const apps = [
    { id: 'finder', name: 'Finder', icon: '/icons/finder.png' },
    { id: 'calculator', name: 'Calculator', icon: '/icons/calculator.png' },
    { id: 'notes', name: 'Notes', icon: '/icons/notes.png' },
    { id: 'safari', name: 'Safari', icon: '/icons/safari.png' },
    { id: 'terminal', name: 'Terminal', icon: '/icons/terminal.png' },
    { id: 'xcode', name: 'Xcode', icon: '/icons/xcode.png' },
    { id: 'settings', name: 'Settings', icon: '/icons/settings.png' },
];

const Launchpad = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const { openWindow } = useOS();

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAppClick = (app) => {
        openWindow(app.id, app.name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="launchpad"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
            >
                <div className="search-bar" onClick={(e) => e.stopPropagation()}>
                    <IoSearch />
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    {search && (
                        <button onClick={() => setSearch('')}>
                            <IoClose />
                        </button>
                    )}
                </div>

                <motion.div
                    className="app-grid"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {filteredApps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            className="app-icon"
                            onClick={() => handleAppClick(app)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src={app.icon} alt={app.name} />
                            <span>{app.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Launchpad;
