import { Object3D, Vector2, Clock, Vector3 } from "three";

class MovementControl {

    constructor() {

        this.clock = new Clock();
        /**@type { Object3D } */
        this.object;
        this.maxSpeed = 1;
        this.enabled = false;
        this.moveFactor = [ 0, 0 ];
        this.rotationEnabled = true;

    }
    /**@param { number } s */
    setMaxSpeed( s ) {

        this.maxSpeed = s;

    }
    /**
     * @param { Object3D } obj 
     */
    setObject( obj ) {

        this.object = obj;

    }
    /**@type { Array< number, number > } */
    move( moveVector ) {

        this.moveFactor = moveVector;

    }
    enable() {

        this.clock.start();
        this._moveObjectAtFrame();

    }
    enableRotation( enable ) {

        this.rotationEnabled = enable;

    }
    _moveObjectAtFrame() {

        let self = this;

        if( this.enable ) {

            this._moveObject();

        }

        requestAnimationFrame( () => { self._moveObjectAtFrame() } );

    }
    _moveObject() {

        let delta = this.clock.getDelta();
        let offset = this._getOffset( delta );

        if( offset.length() > 0 ) {

            this._moveObjectByOffset( offset );

        }

    }
    /**@param { number } delta */
    _getOffset( delta ) {

        let offset = new Vector2( this.moveFactor[ 0 ], this.moveFactor[ 1 ] );

        offset.multiplyScalar( delta * this.maxSpeed );

        return offset;

    }
    /**@param { Vector2 } offset */
    _moveObjectByOffset( offset ) {

        
        if( this.rotationEnabled ) {

            this.object.rotation.reorder( 'YXZ' );
            // let lookAt = new Vector3( offset.x, this.object.position.y, offset.y );
            this.object.rotation.y = Math.atan2( offset.x, offset.y );
            // this.object.lookAt( lookAt );

        }

        this.object.position.x += offset.x;
        this.object.position.z += offset.y;

    }

}

export default MovementControl;