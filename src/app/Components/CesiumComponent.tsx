'use client'

import React from 'react'
import type { CesiumType } from '../types/cesium'
import { type Viewer } from 'cesium';
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

    const resetCamera = React.useCallback(async () => {
        if (cesiumViewer.current !== null) {
            cesiumViewer.current.scene.camera.setView({
                destination: CesiumJs.Cartesian3.fromDegrees(-122.094636, 37.421960, 1055000),
                orientation: {
                  heading: CesiumJs.Math.toRadians(0),
                  pitch: CesiumJs.Math.toRadians(-90),
                },
              });
        }
    }, []);

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
            cesiumViewer.current.clock.multiplier = 60;
            cesiumViewer.current.clock.shouldAnimate = true;

            // Load CZML satellite data
            const czmlDataSource = await CesiumJs.CzmlDataSource.load("/SatellitesOverTime.czml");
            await cesiumViewer.current.dataSources.add(czmlDataSource);
            
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

    const createModel = React.useCallback(() => {
        cesiumViewer.current?.entities.removeAll();
      
        const position = CesiumJs.Cartesian3.fromDegrees(
          -122.094636,
          37.421960,
          55000,
        );
        const heading = CesiumJs.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        const hpr = new CesiumJs.HeadingPitchRoll(heading, pitch, roll);
        const orientation = CesiumJs.Transforms.headingPitchRollQuaternion(position, hpr);
      
        const entity = cesiumViewer.current?.entities.add({
          name: "AcrimSAT.glb",
          position: position,
          orientation: orientation,
          model: {
            uri: "/AcrimSAT.glb",
            minimumPixelSize: 128,
            maximumScale: 20000,
          },
        });
        if (cesiumViewer.current && entity) {
          cesiumViewer.current.trackedEntity = entity;
        }
    }, [CesiumJs]);

    React.useEffect(() => {
        if (cesiumViewer.current === null && cesiumContainerRef.current) {
            CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;

            cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
                terrain: CesiumJs.Terrain.fromWorldTerrain(),
                navigationHelpButton: true,
                baseLayerPicker: false,
                homeButton: false,
                geocoder: false,
                infoBox: false,
                shouldAnimate: true,
            });
        }
    }, []);

    React.useEffect(() => {
        if (isLoaded) return;
        initializeCesiumJs();
    }, [positions, isLoaded]);

    return (
        <div
            ref={cesiumContainerRef}
            id='cesium-container'
            style={{height: '100vh', width: '100vw'}}
        />
    )
}

export default CesiumComponent