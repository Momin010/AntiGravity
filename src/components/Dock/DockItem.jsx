import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useOS } from '../../context/OSContext';

const DockItem = ({ mouseX, app }) => {
    const { openWindow } = useOS();

    const handleClick = () => {
        openWindow(app.id, app.name);
    };

    // Calculate distance from mouse to item
    const ref = React.useRef(null);
    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Transform based on distance
    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const heightSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    return (
        <motion.div
            ref={ref}
            className="dock-item"
            onClick={handleClick}
            style={{
                width: widthSync,
                height: heightSync,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <img src={app.icon} alt={app.name} />
        </motion.div>
    );
};

export default DockItem;