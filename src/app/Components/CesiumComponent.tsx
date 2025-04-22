'use client'

import React from 'react'
import type { CesiumType } from '../types/cesium'
import { type Viewer, Entity } from 'cesium';
import type { Position } from '../types/position';
//NOTE: This is required to get the stylings for default Cesium UI and controls
import 'cesium/Build/Cesium/Widgets/widgets.css';

export const CesiumComponent: React.FunctionComponent<{
    CesiumJs: CesiumType,
    positions: Position[]
}> = ({
    CesiumJs,
    positions
}) => {
    const cesiumViewer = React.useRef<Viewer | null>(null);
    const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isFollowMode, setIsFollowMode] = React.useState(false);
    const satelliteEntityRef = React.useRef<Entity | null>(null);

    const resetCamera = React.useCallback(async () => {
        if (cesiumViewer.current !== null) {
            cesiumViewer.current.scene.camera.setView({
                destination: CesiumJs.Cartesian3.fromDegrees(0, 0, 12000000), // Zoomed out to see the whole Earth
                orientation: {
                  heading: CesiumJs.Math.toRadians(0),
                  pitch: CesiumJs.Math.toRadians(-70),
                },
            });
        }
    }, []);

    const toggleFollowMode = React.useCallback(() => {
        if (!cesiumViewer.current || !satelliteEntityRef.current) return;
        
        setIsFollowMode(prev => {
            const newMode = !prev;
            if (newMode) {
                // Enable follow mode
                cesiumViewer.current!.trackedEntity = satelliteEntityRef.current as Entity;
                // Adjust the camera view relative to the satellite
                cesiumViewer.current!.scene.camera.setView({
                    destination: satelliteEntityRef.current!.position!.getValue(cesiumViewer.current!.clock.currentTime),
                    orientation: {
                        heading: CesiumJs.Math.toRadians(0),
                        pitch: CesiumJs.Math.toRadians(-70),
                        roll: 0
                    }
                });
            } else {
                // Disable follow mode
                cesiumViewer.current!.trackedEntity = undefined;
                resetCamera();
            }
            return newMode;
        });
    }, [CesiumJs.Math, resetCamera]);

    const loadSatelliteData = React.useCallback(async () => {
        try {
            if (!cesiumViewer.current) return;

            // Load KML orbit paths
            const kmlDataSource = await CesiumJs.KmlDataSource.load("/SatellitesOrbits.kml");
            cesiumViewer.current.dataSources.add(kmlDataSource);

            // Configure the clock before loading CZML
            const start = CesiumJs.JulianDate.fromIso8601("2025-04-21T00:00:00Z");
            const stop = CesiumJs.JulianDate.fromIso8601("2025-04-21T01:00:00Z");
            
            // Set up the viewer's clock
            cesiumViewer.current.clock.startTime = start;
            cesiumViewer.current.clock.stopTime = stop;
            cesiumViewer.current.clock.currentTime = start;
            cesiumViewer.current.clock.clockRange = CesiumJs.ClockRange.LOOP_STOP;
            cesiumViewer.current.clock.multiplier = 20;
            cesiumViewer.current.clock.shouldAnimate = true;

            // Load CZML satellite data
            const czmlDataSource = await CesiumJs.CzmlDataSource.load("/SatellitesOverTime.czml");
            await cesiumViewer.current.dataSources.add(czmlDataSource);
            
            // Store reference to the satellite entity
            const satellite = czmlDataSource.entities.getById('sat1');
            if (satellite) {
                satelliteEntityRef.current = satellite;
            }
            
            // Zoom to show all satellites
            await cesiumViewer.current.zoomTo(czmlDataSource);
            
        } catch (error) {
            console.error("Error loading satellite data:", error);
        }
    }, [CesiumJs]);
    
    const initializeCesiumJs = React.useCallback(async () => {
        if (cesiumViewer.current !== null) {
            resetCamera();
            await loadSatelliteData();
            setIsLoaded(true);
        }
    }, [positions, loadSatelliteData, resetCamera]);

    React.useEffect(() => {
        if (cesiumViewer.current === null && cesiumContainerRef.current) {
            CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

            cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
                terrain: CesiumJs.Terrain.fromWorldTerrain(),
                navigationHelpButton: true,
                baseLayerPicker: false,
                homeButton: false,
                geocoder: false,
                infoBox: true,
                shouldAnimate: true,
            });
        }
    }, []);

    React.useEffect(() => {
        if (isLoaded) return;
        initializeCesiumJs();
    }, [positions, isLoaded]);

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
            <div
                ref={cesiumContainerRef}
                id='cesium-container'
                style={{height: '100%', width: '100%'}}
            />
            <button
                onClick={toggleFollowMode}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    backgroundColor: isFollowMode ? '#4CAF50' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
            >
                {isFollowMode ? 'Exit Follow Mode' : 'Follow Satellite'}
            </button>
        </div>
    )
}

export default CesiumComponent