import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import Finder from '../../apps/Finder';
import Calculator from '../../apps/Calculator';
import Notes from '../../apps/Notes';
import Safari from '../../apps/Safari';
import TerminalXterm from '../../apps/TerminalXterm';
import Xcode from '../../apps/Xcode';
import Settings from '../../apps/Settings';
import './Window.scss';

const Window = ({ id, component, isMinimized, isFullScreen, zIndex, filePath }) => {
    const { closeWindow, bringToFront, toggleFullScreen } = useOS();
    const windowRef = useRef(null);

    // Simple mapping for now
    const renderContent = () => {
        switch (id) {
            case 'finder': return <Finder />;
            case 'calculator': return <Calculator />;
            case 'notes': return <Notes />;
            case 'safari': return <Safari />;
            case 'terminal': return <TerminalXterm />;
            case 'xcode': return <Xcode filePath={filePath} />;
            case 'settings': return <Settings />;
            default: return <div className="window-content-placeholder">App Content for {id}</div>;
        }
    };

    if (isMinimized) return null;

    const variants = {
        initial: { scale: 0.8, opacity: 0, x: 100, y: 100 },
        animate: {
            scale: 1,
            opacity: 1,
            width: isFullScreen ? '100%' : 600,
            height: isFullScreen ? 'calc(100% - 30px)' : 400, // Subtract dock/menu space if needed, simplified here
            top: isFullScreen ? 0 : 100,
            left: isFullScreen ? 0 : 100,
            borderRadius: isFullScreen ? 0 : 10,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: { scale: 0.8, opacity: 0 }
    };

    return (
        <motion.div
            className={`window ${isFullScreen ? 'fullscreen' : ''}`}
            drag={!isFullScreen}
            dragMomentum={false}
            style={{ zIndex }}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            onMouseDown={() => bringToFront(id)}
        >
            <div className="title-bar" onDoubleClick={() => toggleFullScreen(id)}>
                <div className="traffic-lights">
                    <div className="light close" onClick={(e) => { e.stopPropagation(); closeWindow(id); }}></div>
                    <div className="light minimize" onClick={(e) => { e.stopPropagation(); /* minimize logic */ }}></div>
                    <div className="light maximize" onClick={(e) => { e.stopPropagation(); toggleFullScreen(id); }}></div>
                </div>
                <div className="title">{component}</div>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </motion.div>
    );
};

export default Window;
