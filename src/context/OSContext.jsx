import React, { createContext, useContext, useState } from 'react';

const OSContext = createContext();

export const useOS = () => useContext(OSContext);

export const OSProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [activeWindows, setActiveWindows] = useState([]);
    import React, { createContext, useContext, useState } from 'react';

    const OSContext = createContext();

    export const useOS = () => useContext(OSContext);

    export const OSProvider = ({ children }) => {
        const [isLocked, setIsLocked] = useState(true);
        const maxZ = Math.max(0, ...activeWindows.map(w => w.zIndex || 0));
        setActiveWindows(activeWindows.map(w =>
            w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
        ));
    };

    const toggleFullScreen = (id) => {
        import React, { createContext, useContext, useState } from 'react';

        const OSContext = createContext();

        export const useOS = () => useContext(OSContext);

        export const OSProvider = ({ children }) => {
            const [isLocked, setIsLocked] = useState(true);
            const [activeWindows, setActiveWindows] = useState([]);
            const [wallpaper, setWallpaper] = useState('https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-2020-5120x2880-1455.jpg');

            const login = () => setIsLocked(false);
            const logout = () => setIsLocked(true);

            const openWindow = (id, component) => {
                if (activeWindows.find(w => w.id === id)) {
                    bringToFront(id);
                    return;
                }
                const maxZ = Math.max(0, ...activeWindows.map(w => w.zIndex || 0));
                setActiveWindows([...activeWindows, { id, component, isMinimized: false, isFullScreen: false, zIndex: maxZ + 1 }]);
            };

            const closeWindow = (id) => {
                setActiveWindows(activeWindows.filter(w => w.id !== id));
            };

            const bringToFront = (id) => {
                const maxZ = Math.max(0, ...activeWindows.map(w => w.zIndex || 0));
                setActiveWindows(activeWindows.map(w =>
                    w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
                ));
            };

            const toggleFullScreen = (id) => {
                setActiveWindows(activeWindows.map(w =>
                    w.id === id ? { ...w, isFullScreen: !w.isFullScreen } : w
                ));
            };

            return (
                <OSContext.Provider value={{ isLocked, login, logout, activeWindows, openWindow, closeWindow, bringToFront, toggleFullScreen, wallpaper }}>
                    {children}
                </OSContext.Provider>
            );
        };
