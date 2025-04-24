import React from 'react'
import type { CesiumType } from '../types/cesium'
import { type Viewer, Entity } from 'cesium';
import type { KMLEvent } from '../types/kml';
//NOTE: This is required to get the stylings for default Cesium UI and controls
import 'cesium/Build/Cesium/Widgets/widgets.css';
import EventTimelinePanel from './EventTimelinePanel';
import { parseKMLEvents } from '../utils/kmlEventParser';
import { initializeViewer } from './CesiumViewer/config';
import { resetCamera, setFollowMode } from './CesiumViewer/cameraControls';
import { loadSatelliteData } from './CesiumViewer/satelliteLoader';
import { STYLES } from './CesiumViewer/styles';
import { useEventHandling } from './CesiumViewer/useEventHandling';

export const CesiumComponent: React.FunctionComponent<{
    CesiumJs: CesiumType
}> = ({
    CesiumJs
}) => {
    const cesiumViewer = React.useRef<Viewer | null>(null);
    const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isFollowMode, setIsFollowMode] = React.useState(false);
    const satelliteEntityRef = React.useRef<Entity | null>(null);
    const [events, setEvents] = React.useState<KMLEvent[]>([]);

    const toggleFollowMode = React.useCallback(() => {
        if (!cesiumViewer.current || !satelliteEntityRef.current) return;
        
        setIsFollowMode(prev => {
            const newMode = !prev;
            if (newMode) {
                setFollowMode(cesiumViewer.current!, CesiumJs, satelliteEntityRef.current!);
            } else {
                cesiumViewer.current!.trackedEntity = undefined;
                resetCamera(cesiumViewer.current!, CesiumJs);
            }
            return newMode;
        });
    }, [CesiumJs]);

    const initializeCesiumJs = React.useCallback(async () => {
        if (cesiumViewer.current !== null) {
            const satellite = await loadSatelliteData(cesiumViewer.current, CesiumJs);
            if (satellite) {
                satelliteEntityRef.current = satellite;
                resetCamera(cesiumViewer.current, CesiumJs);
                setIsLoaded(true);
            }
        }
    }, [CesiumJs]);

    React.useEffect(() => {
        if (cesiumViewer.current === null && cesiumContainerRef.current) {
            cesiumViewer.current = initializeViewer(cesiumContainerRef.current, CesiumJs);
        }
    }, [CesiumJs]);

    React.useEffect(() => {
        if (isLoaded) return;
        initializeCesiumJs();
    }, [isLoaded, initializeCesiumJs]);

    React.useEffect(() => {
        const loadEvents = async () => {
            try {
                const kmlEvents = await parseKMLEvents();
                setEvents(kmlEvents);
            } catch (error) {
                console.error('Error loading KML events:', error);
            }
        };
        
        loadEvents();
    }, []);

    const handleEventClick = useEventHandling(cesiumViewer.current, CesiumJs, events);

    return (
        <div style={STYLES.container}>
            <div
                ref={cesiumContainerRef}
                id='cesium-container'
                style={STYLES.cesiumContainer}
            />
            <button
                onClick={toggleFollowMode}
                style={STYLES.followButton}
            >
                {isFollowMode ? 'Exit Follow Mode' : 'Follow Satellite'}
            </button>
            <EventTimelinePanel 
                events={events}
                onEventClick={handleEventClick}
            />
        </div>
    )
}

export default CesiumComponent