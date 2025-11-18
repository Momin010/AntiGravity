import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OSProvider, useOS } from './context/OSContext';
import { FileSystemProvider } from './context/FileSystemContext';
import { ThemeProvider } from './context/ThemeContext';
import LockScreen from './components/LockScreen/LockScreen';
import Desktop from './components/Desktop/Desktop';
import Launchpad from './components/Launchpad/Launchpad';
import './styles/global.scss';

const AppContent = () => {
    const { isLocked } = useOS();
    const [launchpadOpen, setLaunchpadOpen] = useState(false);

    // Listen for Launchpad toggle (we'll add this to OSContext or handle via key)
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F4' || (e.metaKey && e.key === ' ')) {
                e.preventDefault();
                setLaunchpadOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="app-container">
            <AnimatePresence mode="wait">
                {isLocked ? (
                    <LockScreen key="lockscreen" />
                ) : (
                    <Desktop key="desktop" onLaunchpadToggle={() => setLaunchpadOpen(true)} />
                )}
            </AnimatePresence>
            import React, {useState} from 'react';
            import {AnimatePresence} from 'framer-motion';
            import {OSProvider, useOS} from './context/OSContext';
            import {FileSystemProvider} from './context/FileSystemContext';
            import {ThemeProvider} from './context/ThemeContext';
            import LockScreen from './components/LockScreen/LockScreen';
            import Desktop from './components/Desktop/Desktop';
            import Launchpad from './components/Launchpad/Launchpad';
            import './styles/global.scss';

const AppContent = () => {
    const {isLocked} = useOS();
            const [launchpadOpen, setLaunchpadOpen] = useState(false);

    // Listen for Launchpad toggle (we'll add this to OSContext or handle via key)
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F4' || (e.metaKey && e.key === ' ')) {
                e.preventDefault();
                setLaunchpadOpen(prev => !prev);
            }
        };
            window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

            return (
            <div className="app-container">
                <AnimatePresence mode="wait">
                    {isLocked ? (
                        <LockScreen key="lockscreen" />
                    ) : (
                        <Desktop key="desktop" onLaunchpadToggle={() => setLaunchpadOpen(true)} />
                    )}
                </AnimatePresence>
                <Launchpad isOpen={launchpadOpen} onClose={() => setLaunchpadOpen(false)} />
            </div>
            );
};

            function App() {
    return (
            <ThemeProvider>
                <OSProvider>
                    <FileSystemProvider>
                        <AppContent />
                    </FileSystemProvider>
                </OSProvider>
            </ThemeProvider>
            );
}

            export default App;
