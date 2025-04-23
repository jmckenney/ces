'use client'

import React from 'react';

interface Event {
    name: string;
    scheduledTime: string;
    completionTime: string;
    type: 'photo' | 'upload' | 'signal';
    status: 'scheduled' | 'completed';
    coordinates: number[];
}

interface EventTimelinePanelProps {
    events: Event[];
    onEventClick: (name: string, coordinates: number[]) => void;
}

const EventTimelinePanel: React.FC<EventTimelinePanelProps> = ({ 
    events, 
    onEventClick, 
}) => {
    const getEventIcon = (type: string) => {
        switch(type) {
            case 'photo': return '📸';
            case 'upload': return '⬆️';
            case 'signal': return '📡';
            default: return '📍';
        }
    };

    return (
        <div style={{
            position: 'absolute',
            left: '0px',
            top: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '15px',
            borderRadius: '8px',
            width: '300px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            color: 'white',
            zIndex: 1000,
            fontFamily: 'sans-serif'
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Mission Timeline</h3>
            {events.map((event, index) => (
                <div
                    key={index}
                    onClick={() => onEventClick(event.name, event.coordinates)}
                    style={{
                        padding: '10px',
                        marginBottom: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        borderLeft: `4px solid ${event.status === 'completed' ? '#4CAF50' : '#FFC107'}`,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{getEventIcon(event.type)}</span>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{event.name}</div>
                            <div style={{ fontSize: '0.8em', color: '#aaa' }}>
                                {event.coordinates.join(', ')}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventTimelinePanel; 