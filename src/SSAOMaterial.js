import { ShaderMaterial, Uniform, Texture } from 'three';

const V_SHADER = `
    varying vec2 v_uv;
    void main() {

        v_uv = uv;
        gl_Position = vec4( position * 2.0, 1.0 );

    }
`;
const F_SHADER = `
    varying vec2 v_uv;
    uniform sampler2D positionMap;
    uniform sampler2D normalMap;
    uniform sampler2D noiseMap;
    uniform mat4 projectionMatrix;
    const int KERNEL_SIZE = 32;
    uniform vec3 samples[ KERNEL_SIZE ];

    void main() {

        vec2 noiseMapUV = vec2( mod( gl_FragCoord.x, 4.0 ) / 3.0, mod( gl_FragCoord.y, 4.0 ) / 3.0 );

        vec3 fragPos = texture2D( positionMap, v_uv ).xyz;
        vec3 normal = texture2D( normalMap, v_uv ).rgb;
        vec3 randomVec = texture2D( noiseMap, noiseMapUV ).xyz * 2.0 - 1.0;

        vec3 tangent = normalize( randomVec - normal * dot( randomVec, normal ) );
        vec3 bitangent = cross( normal, tangent );
        mat3 TBN = mat3( tangent, bitangent, normal );

        float occlusion = 0.0;
        float radius = 1.0;
        for( int i = 0; i < KERNEL_SIZE; ++i )
        {
            // get sample position
            vec3 sample = TBN * samples[ i ]; // From tangent to view-space
            sample = fragPos + sample * radius;
            
            vec4 offset = vec4( sample, 1.0 );
            offset = projectionMatrix * offset; // from view to clip-space
            offset.xyz /= offset.w;               // perspective divide
            offset.xyz  = offset.xyz * 0.5 + 0.5; // transform to range 0.0 - 1.0

            float sampleDepth = texture2D( positionMap, offset.xy ).z;
            float rangeCheck = smoothstep( 0.0, 1.0, radius / abs( sampleDepth - fragPos.z ) );
            occlusion += ( sampleDepth >= sample.z ? 1.0 : 0.0 ) * rangeCheck;

        }

        gl_FragColor = vec4( 1.0 - vec3( occlusion / float( KERNEL_SIZE ) ), 1.0 );

    }
`;

class SSAOMaterial extends ShaderMaterial {

    constructor() {

        super( {

            vertexShader: V_SHADER,
            fragmentShader: F_SHADER,
            uniforms: {
                noiseMap: new Uniform(),
                positionMap: new Uniform(),
                normalMap: new Uniform(),
                samples: new Uniform( [] ),
                projectionMatrix: new Uniform()
            }

        } )

    }
    /**
     * @param { Texture } t 
     */
    setNoiseMap( t ) {

        this.uniforms.noiseMap.value = t;

    }
    /**
     * @param { Texture } t 
     */
    setPositionMap( t ) {

        this.uniforms.positionMap.value = t;

    }
    /**
     * @param { Texture } t 
     */
    setNormalMap( t ) {

        this.uniforms.normalMap.value = t;

    }
    /**
     * @param { Array< Vector3 > } s
     */
    setSamples( s ) {

        this.uniforms.samples.value = s;

    }
    /**
     * @param { Matrix4 } m 
     */
    setProjectionMatrix( m ) {

        this.uniforms.projectionMatrix.value = m;

    }

}

export default SSAOMaterial;