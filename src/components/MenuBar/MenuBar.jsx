import React, { useState, useEffect } from 'react';
import { FaApple } from 'react-icons/fa';
import { BsBatteryFull, BsWifi } from 'react-icons/bs';
import { IoSearch, IoOptionsOutline } from 'react-icons/io5';
import './MenuBar.scss';

const MenuBar = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="menu-bar">
            <div className="left">
                <div className="apple-logo"><FaApple /></div>
                <span className="app-name">Finder</span>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Go</span>
                <span>Window</span>
                <span>Help</span>
            </div>
            <div className="right">
                <div className="status-icon"><BsBatteryFull /> 100%</div>
                <div className="status-icon"><BsWifi /></div>
                <div className="status-icon"><IoSearch /></div>
                <div className="status-icon"><IoOptionsOutline /></div>
                <div className="clock">
                    {formatDate(time)} &nbsp; {formatTime(time)}
                </div>
            </div>
        </div>
    );
};

export default MenuBar;
