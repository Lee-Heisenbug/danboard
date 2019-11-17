import { WebGLRenderer, Material, Scene, Camera } from 'three';

class SceneRenderer {

    constructor() {

        this.renderer = new WebGLRenderer();
        this._decoDOM();
        this.sceneMaterial = this._getSceneMaterial();

    }
    /**
     * @abstract
     */
    _decoDOM() {}
    /**
     * @abstract
     * @returns { Material }
     */
    _getSceneMaterial() {}
    /**
     * @param { Scene } scene 
     * @param { Camera } camera 
     */
    render( scene, camera ) {

        scene.overrideMaterial = this.sceneMaterial;

        this.renderer.render( scene, camera );

        scene.overrideMaterial = null;

    }
    /**
     * @returns { Texture }
     */
    getRenderResult() {



    }
    getDOM() {

        return this.renderer.domElement;

    }
    /**
     * @param { Vector2 } s 
     */
    setSize( s ) {

        this.renderer.setSize( s.x, s.y );

    }

}

export default SceneRenderer;