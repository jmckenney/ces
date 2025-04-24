import type { CesiumType } from '../../types/cesium';
import type { Viewer, Entity } from 'cesium';
import { CLOCK_CONFIG } from './config';

export const loadSatelliteData = async (
    viewer: Viewer,
    CesiumJs: CesiumType
): Promise<Entity | null> => {
    try {
        // Load KML orbit paths
        const kmlDataSource = await CesiumJs.KmlDataSource.load("/SatellitesOrbits.kml");
        await viewer.dataSources.add(kmlDataSource);

        // Configure the clock
        const start = CesiumJs.JulianDate.fromIso8601(CLOCK_CONFIG.startTime);
        const stop = CesiumJs.JulianDate.fromIso8601(CLOCK_CONFIG.stopTime);
        
        // Set up the viewer's clock
        viewer.clock.startTime = start;
        viewer.clock.stopTime = stop;
        viewer.clock.currentTime = start;
        viewer.clock.clockRange = CesiumJs.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = CLOCK_CONFIG.multiplier;
        viewer.clock.shouldAnimate = true;

        // Load CZML satellite data
        const czmlDataSource = await CesiumJs.CzmlDataSource.load("/SatellitesOverTime.czml");
        await viewer.dataSources.add(czmlDataSource);
        
        // Get satellite entity
        const satellite = czmlDataSource.entities.getById('sat1');
        if (satellite) {
            await viewer.zoomTo(czmlDataSource);
            return satellite;
        }
        
        return null;
    } catch (error) {
        console.error("Error loading satellite data:", error);
        return null;
    }
}; 