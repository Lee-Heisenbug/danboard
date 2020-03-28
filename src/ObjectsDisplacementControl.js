import { Object3D, Vector2, Vector3 } from "three";

class ObjectsDisplacementControl {

    constructor() {

        /**@type { Array< Object3D > } */
        this.objects = [];
        this.maxVelocity = new Vector2();
        this.factor = new Vector2();

    }
    /**
     * @param { Array< Object3D > } objs 
     */
    setObjects( objs ) {

        this.objects = objs;

    }
    /**
     * @param { Vector2 } v 
     */
    setMaxVelocity( v ) {

        this.maxVelocity = v;

    }
    /**
     * @param { Vector2 } f 
     */
    setFactor( f ) {

        this.factor = f;

    }
    /**
     * @param { number } t 
     */
    moveByTime( t ) {

        let self = this;
        let offset = new Vector2();
        offset.copy( this.factor );
        offset.multiply( this.maxVelocity );
        offset.multiply( new Vector2( 1, -1 ) );
        offset.multiplyScalar( t );

        this.objects.forEach( obj => {

            obj.position.add( new Vector3( offset.x, 0, offset.y ) );

        } );

    }

}

export default ObjectsDisplacementControl;