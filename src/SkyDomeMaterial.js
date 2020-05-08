import { ShaderMaterial, Uniform, Color, BackSide } from "three";

const V_SHADER = `
varying vec3 vWorldPosition;

void main() {

    vWorldPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`

const F_SHADER = `
uniform vec3 topColor;
uniform vec3 groundColor;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

    float h = normalize( vWorldPosition ).y;
    gl_FragColor = vec4( mix( groundColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

}
`
class SkyDomeMaterial extends ShaderMaterial {
    /**
     * @param { Color } topColor 
     * @param { Color } groundColor 
     */
    constructor( topColor, groundColor ) {
        super( {

            vertexShader: V_SHADER,
            fragmentShader: F_SHADER,
            uniforms: {
                topColor: new Uniform( topColor ),
                groundColor: new Uniform( groundColor ),
                exponent: new Uniform( 0.6 )
            },
            side: BackSide

        } )
    }
}

export default SkyDomeMaterial