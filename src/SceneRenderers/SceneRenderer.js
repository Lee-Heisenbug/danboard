import { WebGLRenderer, Material, Scene, Camera } from 'three';
import Renderable from '../Renderable';

class SceneRenderer extends Renderable {

    constructor() {

        super();
        /**@type { WebGLRenderer } */
        this.renderer;
        this.sceneMaterial = this._getSceneMaterial();
        /**@type { Scene } */
        this.scene;
        /**@type { Camera } */
        this.camera;

    }
    /**
     * @abstract
     * @returns { Material }
     */
    _getSceneMaterial() {}
    render() {

        this.scene.overrideMaterial = this.sceneMaterial;

        this.renderer.render( this.scene, this.camera );

        this.scene.overrideMaterial = null;

    }
    /**
     * @param { WebGLRenderer } r 
     */
    setRenderer( r ) {

        this.renderer = r;

    }
    /**
     * @param { Scene } s
     */
    setScene( s ) {

        this.scene = s;

    }
    /**
     * @param { Camera } c 
     */
    setCamera( c ) {

        this.camera = c;

    }

}

export default SceneRenderer;