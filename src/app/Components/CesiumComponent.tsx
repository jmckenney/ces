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
    
    const initializeCesiumJs = React.useCallback(async () => {
        if (cesiumViewer.current !== null) {
            resetCamera();
            createModel();

            //Set loaded flag
            setIsLoaded(true);
        }
    }, [positions]);

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