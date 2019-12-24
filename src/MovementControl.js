import { Object3D, Vector2 } from "three";

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
    /**@type { Array< number, number > } */
    move( moveVector ) {

        let velocity = new Vector2( moveVector[ 0 ], moveVector[ 1 ] );
        
        this.object.rotation.reorder( 'YXZ' );

        this.object.rotation.y = Math.atan2( velocity.y, velocity.x ) - Math.PI / 2;

        this.object.translateZ( velocity.length() );


    }

}

export default MovementControl;