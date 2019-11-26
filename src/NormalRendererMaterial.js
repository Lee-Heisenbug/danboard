import { ShaderMaterial, Uniform } from 'three';

const V_SHADER = `
    varying vec2 v_uv;
    void main() {

        v_uv = uv;
        gl_Position = vec4( position * 2.0, 1.0 );

    }
`;
const F_SHADER = `
    varying vec2 v_uv;
    uniform sampler2D map;
    void main() {

        gl_FragColor = texture2D( map, v_uv );

    }
`;

class NormalRendererMaterial extends ShaderMaterial {

    constructor() {

        super( {

            vertexShader: V_SHADER,
            fragmentShader: F_SHADER,
            uniforms: {
                map: new Uniform()
            }

        } )

    }

}

export default NormalRendererMaterial;