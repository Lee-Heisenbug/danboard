import { Object3D } from "three";

class MovementControl {

    constructor() {

        /**@type { Object3D } */
        this.object;

    }
    /**
     * @param { Object3D } obj 
     */
    setObject( obj ) {

        this.object = obj;

    }
    move( factor ) {

        this.object.translateZ( factor );

    }
    turn( factor ) {

        this.object.rotation.reorder( 'YXZ' );
        this.object.rotation.y = factor;

    }

}

export default MovementControl;