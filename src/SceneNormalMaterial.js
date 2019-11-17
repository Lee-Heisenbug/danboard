import { ShaderMaterial } from 'three';

const V_SHADER = `
    varying vec3 v_normal;
    void main() {

        v_normal = normalize( vec3( normalMatrix * normal ) );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
`;
const F_SHADER = `
    varying vec3 v_normal;
    void main() {

        gl_FragColor = vec4( normalize(v_normal), 1.0 );

    }
`;

class SceneNormalMaterial extends ShaderMaterial {

    constructor() {

        super( {

            vertexShader: V_SHADER,
            fragmentShader: F_SHADER

        } )

    }

}

export default SceneNormalMaterial;