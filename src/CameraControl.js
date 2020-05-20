import { Object3D, Camera, Vector3 } from "three";
import { OrbitControls } from "./OrbitControls";

class CameraControl {

    /**
     * @param { Object3D } targetObject 
     * @param { Camera } camera 
     * @param { HTMLElement } dom 
     */
    constructor( targetObject, camera, dom ) {

        this.targetObject = targetObject;
        this.orbitControls = new OrbitControls( camera, dom ); 
        this.orbitControls.maxPolarAngle = Math.PI * 3 / 6
        this.orbitControls.minPolarAngle = Math.PI / 6
        this.orbitControls.maxDistance = 20
        this.orbitControls.minDistance = 20

    }
    update() {

        this.orbitControls.target.copy( this.targetObject.position );
        this.orbitControls.target.add( new Vector3( 0, 4, 0 ) )
        this.orbitControls.update();
    }

}

export default CameraControl;