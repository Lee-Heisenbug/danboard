import { WebGLRenderer, Scene, Camera, Texture } from 'three';
import SceneDepthMaterial from './SceneDepthMaterial';

class SceneDepthRenderer {

    constructor() {

        this.renderer = new WebGLRenderer();
        this._decoDOM();
        this.sceneDepthMaterial = new SceneDepthMaterial();

    }
    _decoDOM() {

        this.renderer.domElement.classList.add( 'scene-depth' );

    }
    getDOM() {

        return this.renderer.domElement;

    }
    /**
     * @param { Scene } scene 
     * @param { Camera } camera 
     */
    render( scene, camera ) {

        scene.overrideMaterial = this.sceneDepthMaterial;

        this.renderer.render( scene, camera );

        scene.overrideMaterial = null;

    }
    /**
     * @returns { Texture }
     */
    getRenderResult() {



    }
    /**
     * @param { Vector2 } s 
     */
    setSize( s ) {

        this.renderer.setSize( s.x, s.y );

    }

}

export default SceneDepthRenderer;