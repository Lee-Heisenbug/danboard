import ObjectsDisplacementControl from './ObjectsDisplacementControl';
import { Vector2, Camera, Object3D, Vector3, Matrix4 } from 'three';

export default class CameraRelativeObjectMovementControl {

    /**
     * @param { Camera } camera 
     * @param { Object3D } object 
     */
    constructor( camera, object ) {
        this.camera = camera;
        this.object = object;
        this.objectDisplacementControl = new ObjectsDisplacementControl();
        this.objectDisplacementControl.setObjects( [ object ] );
    }
    /**
     * @param { number } x 
     * @param { number } z 
     */
    move( x, z ) {

        this.objectDisplacementControl.setFactor( new Vector2( x, z ));

    }
    /**
     * @param { number } speed 
     */
    setSpeed( speed ) {

        this.objectDisplacementControl.setMaxVelocity( new Vector2( speed, speed ) )
    }
    /**
     * @param { number } delta 
     */
    updateByTime( delta ) {

        let cameraHorizontalDouble = this.camera.clone();
        let objectParentMatrixWorldInverse = new Matrix4();
        let cameraRelativePosition = new Vector3();
        let objectWorldPosition = new Vector3();

        cameraHorizontalDouble.rotation.reorder( 'YXZ' );
        cameraHorizontalDouble.rotation.x = 0;
        cameraHorizontalDouble.updateMatrix();
        // cameraHorizontalDouble.updateWorldMatrix( true );
        cameraHorizontalDouble.updateMatrixWorld();
        
        this.object.updateMatrix();
        // this.object.updateWorldMatrix( true );
        this.object.updateMatrixWorld();
        objectParentMatrixWorldInverse.getInverse( this.object.parent.matrixWorld );

        this.object.getWorldPosition( cameraRelativePosition );
        cameraRelativePosition.applyMatrix4( cameraHorizontalDouble.matrixWorldInverse );
        this.object.position.copy( cameraRelativePosition );
        this.objectDisplacementControl.moveByTime( delta );

        this.object.position.applyMatrix4( cameraHorizontalDouble.matrixWorld );
        objectWorldPosition.copy( this.object.position )

        this.object.position.copy( objectWorldPosition );
        this.object.position.applyMatrix4( objectParentMatrixWorldInverse );
        
    }

};
