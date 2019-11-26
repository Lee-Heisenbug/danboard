import { Vector3 } from 'three';

const COUNT = 32;

class SSAOKernel {

    constructor() {

        /**@type { Array< Vector3 > } */
        this.samples = [];
        this._generateSamples();

    }
    _generateSamples() {

        for( let i = 0; i < COUNT; ++i ) {

            let scalar = this._generateScalar( i );
            this.samples.push( this._generateSample( scalar ) );

        }

    }
    /**
     * @param { number } index 
     */
    _generateScalar( index ) {

        let scalar = index / COUNT;

        return this._lerp( 0.1, 1.0, scalar * scalar );

    }
    /**
     * @param { number } a 
     * @param { number } b 
     * @param { number } f 
     */
    _lerp( a, b, f ) {

        return a + f * ( b - a );

    }
    _generateSample( scalar ) {

        let sample = new Vector3(
            Math.random() * 2.0 - 1.0,
            Math.random() * 2.0 - 1.0,
            Math.random()
        );

        sample.normalize();
        sample.multiplyScalar( scalar );
        return sample;

    }

}

export default SSAOKernel;