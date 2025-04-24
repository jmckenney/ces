import type { Viewer } from 'cesium';
import type { CesiumType } from '../../types/cesium';

export const VIEWER_CONFIG = {
    navigationHelpButton: false,
    baseLayerPicker: false,
    homeButton: false,
    geocoder: false,
    infoBox: true,
    shouldAnimate: true,
    sceneModePicker: false,
};

export const CLOCK_CONFIG = {
    startTime: "2025-04-21T00:00:00Z",
    stopTime: "2025-04-21T01:00:00Z",
    multiplier: 20,
};

export const initializeViewer = (
    container: HTMLDivElement,
    CesiumJs: CesiumType
): Viewer => {
    CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;
    
    return new CesiumJs.Viewer(container, {
        ...VIEWER_CONFIG,
        terrain: CesiumJs.Terrain.fromWorldTerrain(),
    });
}; 