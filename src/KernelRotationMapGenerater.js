import { DataTexture, Vector3, RGBFormat, UVMapping, RepeatWrapping, NearestFilter } from 'three';

class KernelRotationMapGenerater {

    constructor() {

        this.width = 4;
        this.height = 4;
        /**@type { Array< Vector3 > } */
        this.noises = [];
        /**@type { DataTexture } */
        this.noiseMap;

    }
    getMap() {

        this._generateMap();
        return this.noiseMap;

    }
    _generateMap() {

        this._generateNoises();

        this.noiseMap = new DataTexture(
            this._generateMapData(),
            this.width,
            this.height,
            RGBFormat,
            undefined,
            UVMapping,
            RepeatWrapping,
            RepeatWrapping,
            NearestFilter,
            NearestFilter
        );

    }
    _generateMapData() {

        let length = this._getLength();
        let data = new Uint8Array( 3 * length );
        const maxValue = Math.pow( 2, 8 ) - 1;

        this.noises.forEach( ( noise, index ) => {

            let stride = index * 3;

            data[ stride ] = ( noise.x + 1 ) / 2 * maxValue;
            data[ stride + 1 ] = ( noise.y + 1 ) / 2 * maxValue;
            data[ stride + 2 ] = 0.0;

        } )

        return data;

    }
    _getLength() {

        return this.height * this.width;

    }
    _generateNoises() {

        let length = this.width * this.height;

        for( let i = 0; i < length; ++i ) {

            this.noises.push( new Vector3(

                Math.random() * 2.0 - 1.0,
                Math.random() * 2.0 - 1.0,
                0.0

            ) );

        }

    }

}

export default KernelRotationMapGenerater;