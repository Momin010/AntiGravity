import React from 'react';
import { useOS } from '../../context/OSContext';
import MenuBar from '../MenuBar/MenuBar';
import Dock from '../Dock/Dock';
import Window from '../Window/Window';
import './Desktop.scss';

const Desktop = ({ onLaunchpadToggle }) => {
    const { wallpaper, activeWindows } = useOS();

    return (
        <div
            className="desktop"
            style={{ backgroundImage: `url(${wallpaper})` }}
        >
            <MenuBar onLaunchpadToggle={onLaunchpadToggle} />

            <div className="desktop-area">
                {activeWindows.map(window => (
                    <Window key={window.id} id={window.id} {...window} />
                ))}
            </div>

            <Dock />
        </div>
    );
};

export default Desktop;
