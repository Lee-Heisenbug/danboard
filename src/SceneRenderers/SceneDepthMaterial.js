import { ShaderMaterial } from 'three';

const V_SHADER = `

    varying vec4 v_position;
    void main() {

        v_position = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * v_position;

    }

`;
const F_SHADER = `
    varying vec4 v_position;
    void main() {

        gl_FragColor = v_position;

    }
`;

class SceneDepthMaterial extends ShaderMaterial {

    constructor() {

        super( {

            vertexShader: V_SHADER,
            fragmentShader: F_SHADER

        } )

    }

}

export default SceneDepthMaterial;