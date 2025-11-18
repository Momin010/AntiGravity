<div className="dock-container">
    <motion.div
        className="dock"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(null)}
    >
        {apps.map((app) => (
            <DockItem key={app.id} mouseX={mouseX} app={app} />
        ))}
    </motion.div>
</div>
    );
};

export default Dock;
