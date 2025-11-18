import React, { useState } from 'react';
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
