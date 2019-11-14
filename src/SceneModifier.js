import { Scene, AmbientLight } from 'three';

class SceneModifier {

    /**
     * @param { Scene } scene 
     */
    constructor( scene ) {

        this.scene = scene;

    }
    getScene() {

        this._modifyScene();
        return this.scene;

    }
    _modifyScene() {

        this.scene.add( ...this._createLights() );

        this.scene.traverse( obj => {

            if( obj.isMesh ) {

                obj.castShadow = true;
                obj.receiveShadow = true;

            } else if( obj.isSpotLight ) {

                obj.castShadow = true;

            }
            
        } )

    }
    _createLights() {

        return [ new AmbientLight( '#ffffff', 1.5 ) ];

    }

}

export default SceneModifier;