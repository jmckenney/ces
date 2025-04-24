import type { CesiumType } from '../../types/cesium';
import type { Viewer, Entity } from 'cesium';

export const resetCamera = (viewer: Viewer, CesiumJs: CesiumType) => {
    viewer.scene.camera.setView({
        destination: CesiumJs.Cartesian3.fromDegrees(90, 0, 12000000),
        orientation: {
            heading: CesiumJs.Math.toRadians(0),
            pitch: CesiumJs.Math.toRadians(-80),
        },
    });
};

export const setFollowMode = (
    viewer: Viewer,
    CesiumJs: CesiumType,
    satelliteEntity: Entity
) => {
    viewer.trackedEntity = satelliteEntity;
    viewer.scene.camera.setView({
        destination: satelliteEntity.position!.getValue(viewer.clock.currentTime),
        orientation: {
            heading: CesiumJs.Math.toRadians(0),
            pitch: CesiumJs.Math.toRadians(-70),
            roll: 0
        }
    });
}; 