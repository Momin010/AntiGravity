import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { IoSunny, IoMoon } from 'react-icons/io5';
import './Settings.scss';

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [instanceName, setInstanceName] = React.useState(() => {
        return localStorage.getItem('macos-instance-name') || 'User';
    });

    const handleInstanceNameChange = (e) => {
        const name = e.target.value;
        setInstanceName(name);
        localStorage.setItem('macos-instance-name', name);
    };

    return (
        <div className="settings-app">
            <div className="sidebar">
                <div className="section-title">Settings</div>
                <div className="menu-item active">Appearance</div>
                <div className="menu-item">Desktop & Dock</div>
                <div className="menu-item">Users</div>
                <div className="menu-item">Storage</div>
            </div>

            <div className="content">
                <h2>Appearance</h2>

                <div className="setting-group">
                    <div className="setting-label">Theme</div>
                    <div className="theme-selector">
                        <div
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <IoSunny />
                            <span>Light</span>
                        </div>
                        <div
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <IoMoon />
                            <span>Dark</span>
                        </div>
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">Instance Name</div>
                    <input
                        type="text"
                        value={instanceName}
                        onChange={handleInstanceNameChange}
                        placeholder="Enter instance name"
                    />
                    <div className="setting-description">
                        This name will appear in the terminal and file paths
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">About</div>
                    <div className="about-info">
                        <p><strong>macOS Web Simulation</strong></p>
                        <p>Version 1.0.0</p>
                        <p>A fully functional virtual operating system running in your browser</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
