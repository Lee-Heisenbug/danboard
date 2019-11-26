import { PerspectiveCamera, Scene, PlaneBufferGeometry, Mesh, Material } from 'three';
import Renderable from './Renderable';

class PlaneRenderer extends Renderable {

    constructor() {

        super();
        this.camera = new PerspectiveCamera();
        this.scene = new Scene();
        this.material = this._getPlaneMaterial();
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1, 1, 1 ), this.material );
        this.scene.add( this.plane );

    }
    /**
     * @abstract
     * @returns { Material }
     */
    _getPlaneMaterial() {}
    render() {

        this.renderer.render( this.scene, this.camera );

    }
    /**
     * @param { WebGLRenderer } r 
     */
    setRenderer( r ) {

        this.renderer = r;

    }

}

export default PlaneRenderer;