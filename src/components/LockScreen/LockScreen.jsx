import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import './LockScreen.scss';

const LockScreen = () => {
    const { login } = useOS();
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate auth
        login();
    };

    return (
        <motion.div
            className="lock-screen"
            initial={{ y: 0 }}
            exit={{ y: -1000 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="clock-container">
                <h1>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
                <p>{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
                <div className="avatar">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjY3ZWVhIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMCA4NWMwLTE1IDEyLjUtMjcuNSAyOC0yNy41czI4IDEyLjUgMjggMjcuNSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjQiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=" alt="User" />
                </div>
                <h3>User</h3>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </form>
        </motion.div>
    );
};

export default LockScreen;
