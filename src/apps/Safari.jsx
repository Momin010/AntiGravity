import React, { useState } from 'react';
import { IoAdd, IoClose, IoChevronBack, IoChevronForward, IoRefresh } from 'react-icons/io5';
import './Safari.scss';

const Safari = () => {
    const [tabs, setTabs] = useState([
        { id: 1, title: 'Google', url: 'https://www.google.com' }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [inputUrl, setInputUrl] = useState('https://www.google.com');

    const activeTab = tabs.find(t => t.id === activeTabId);

    const addTab = () => {
        const newTab = {
            id: Date.now(),
            title: 'New Tab',
            url: 'about:blank'
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
        setInputUrl('about:blank');
    };

    const closeTab = (e, id) => {
        e.stopPropagation();
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id && newTabs.length > 0) {
            setActiveTabId(newTabs[0].id);
            setInputUrl(newTabs[0].url);
        }
    };

    const switchTab = (tab) => {
        setActiveTabId(tab.id);
        setInputUrl(tab.url);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        const newTabs = tabs.map(t =>
            t.id === activeTabId ? { ...t, url: inputUrl, title: inputUrl.split('/')[2] || 'Page' } : t
        );
        setTabs(newTabs);
    };

    return (
        <div className="safari-app">
            <div className="tab-bar">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                        onClick={() => switchTab(tab)}
                    >
                        <span className="tab-title">{tab.title}</span>
                        {tabs.length > 1 && (
                            <button className="close-tab" onClick={(e) => closeTab(e, tab.id)}>
                                <IoClose />
                            </button>
                        )}
                    </div>
                ))}
                <button className="add-tab" onClick={addTab}>
                    <IoAdd />
                </button>
            </div>

            <div className="toolbar">
                <div className="nav-buttons">
                    <button><IoChevronBack /></button>
                    <button><IoChevronForward /></button>
                    <button><IoRefresh /></button>
                </div>
                <form className="url-bar" onSubmit={handleUrlSubmit}>
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Enter URL"
                    />
                </form>
            </div>

            <div className="content-area">
                {activeTab?.url === 'about:blank' ? (
                    <div className="blank-page">
                        <h2>New Tab</h2>
                        <p>Enter a URL to browse</p>
                    </div>
                ) : (
                    <div className="mock-page">
                        <div className="mock-header">Mock Page: {activeTab?.url}</div>
                        <div className="mock-content">
                            <p>This is a simulated browser view.</p>
                            <p>In a real implementation, you could use an iframe for safe sites or build custom content.</p>
                            <p>Current URL: <strong>{activeTab?.url}</strong></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Safari;
