import { PerspectiveCamera, Scene, PlaneBufferGeometry, Mesh, TextureLoader, WebGLRenderer } from 'three';
import boxDiffuse from './box_diffuse.png';
import Renderable from './Renderable';
import NormalRendererMaterial from './NormalRendererMaterial';

class NormalRenderer extends Renderable {

    constructor() {

        super();
        this.camera = new PerspectiveCamera();
        this.scene = new Scene();
        this.material = new NormalRendererMaterial();
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1, 1, 1 ), this.material );
        this.scene.add( this.plane );

    }
    _setTexutre() {

        let self = this;
        new TextureLoader().load( boxDiffuse, t => { self.material.uniforms.map.value = t } )
        console.log( this.plane.geometry );

    }
    render() {

        this.renderer.render( this.scene, this.camera );

    }
    /**
     * @param { WebGLRenderer } r 
     */
    setRenderer( r ) {

        this.renderer = r;

    }
    setTexture( t ) {

        this.material.uniforms.map.value = t;

    }

}

export default NormalRenderer;