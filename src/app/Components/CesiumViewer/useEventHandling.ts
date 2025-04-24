import { useCallback } from 'react';
import type { CesiumType } from '../../types/cesium';
import type { Viewer } from 'cesium';
import type { KMLEvent } from '../../types/kml';

export const useEventHandling = (
    viewer: Viewer | null,
    CesiumJs: CesiumType,
    events: KMLEvent[]
) => {
    return useCallback((name: string, coordinates: number[]) => {
        if (!viewer) return;
        
        const event = events.find(e => e.name === name);
        if (event) {
            // Set time to event's scheduled time
            const julianDate = CesiumJs.JulianDate.fromIso8601(event.scheduledTime);
            viewer.clock.currentTime = julianDate;

            // Fly to event location
            viewer.camera.flyTo({
                destination: CesiumJs.Cartesian3.fromDegrees(
                    coordinates[0],
                    coordinates[1],
                    coordinates[2] + 500000
                ),
                orientation: {
                    heading: CesiumJs.Math.toRadians(0),
                    pitch: CesiumJs.Math.toRadians(-80),
                    roll: 0
                }
            });
        }
    }, [CesiumJs.JulianDate, CesiumJs.Cartesian3, CesiumJs.Math, events, viewer]);
}; 