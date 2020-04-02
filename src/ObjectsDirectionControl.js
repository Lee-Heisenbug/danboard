import { Object3D, Vector2 } from "three";

class ObjectsDirectionControl {

    constructor() {

        /**@type { Array< Object3D > } */
        this.objects = [];

    }
    /**
     * @param { Array< Object3D > } objs 
     */
    setObjects( objs ) {

        this.objects = objs;

    }
    /**
     * @param { Vector2 } dir 
     */
    setDirection( dir ) {

        this.objects.forEach( obj => {

            obj.rotation.reorder( 'YXZ' );
            obj.rotation.y = Math.atan2( dir.y, dir.x ) + Math.PI / 2;

        } );

    }

}

export default ObjectsDirectionControl;