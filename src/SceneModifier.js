import { Scene, AmbientLight, Texture, Mesh, Color, SphereBufferGeometry } from 'three';
import StandardSSAOMaterial from './StandardSSAOMaterial';
import SkyDome from './SkyDome';

class SceneModifier {

    /**
     * @param { Scene } scene 
     */
    constructor( scene ) {

        this.scene = scene;
        this.ssaoTexture;

    }
    getScene() {

        this._modifyScene();
        return this.scene;

    }
    /**
     * 
     * @param { Texture } t 
     */
    setSSAO( t ) {

        this.ssaoTexture = t;

    }
    _modifyScene() {

        let self = this;

        this.scene.add( ...this._createLights() );

        this.scene.traverse( obj => {

            if( obj.isMesh ) {

                self._setupMaterial( obj );
                obj.castShadow = true;
                obj.receiveShadow = true;

            } else if( obj.isSpotLight ) {

                obj.castShadow = true;

            }
            
        } )

        this.scene.add( this._createSkyDome() );

    }
    _createLights() {

        return [ new AmbientLight( '#ffffff', 5 ) ];

    }
    /**
     * @param { Mesh } obj 
     */
    _setupMaterial( obj ) {

        let originMaterial = obj.material;
        obj.material = new StandardSSAOMaterial( obj.material.uniforms );
        obj.material.uniforms.ssaoMap.value = this.ssaoTexture;
        obj.material.uniforms.diffuse.value = originMaterial.color;

    }
    
    _createSkyDome() {

        return new SkyDome( new Color( 0x3a96ff ), new Color( 0xffffff ) );

    }

}

export default SceneModifier;