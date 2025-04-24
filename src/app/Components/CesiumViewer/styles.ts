export const STYLES = {
    container: {
        position: 'relative' as const,
        height: '100vh',
        width: '100vw',
    },
    cesiumContainer: {
        height: '100%',
        width: '100%',
    },
    followButton: {
        width: '210px',
        textAlign: 'left' as const,
        position: 'absolute' as const,
        top: '10px',
        left: '10px',
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
}; 