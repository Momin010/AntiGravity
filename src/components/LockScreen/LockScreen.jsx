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
                    <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
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
