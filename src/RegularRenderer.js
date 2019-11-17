import { WebGLRenderer, Scene, Camera } from 'three';

class RegularRenderer {

    constructor() {

        this.renderer = new WebGLRenderer();
        this.renderer.gammaOutput = true;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMapEnabled = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        
    }
    _decoDOM() {

        this.renderer.domElement.classList.add( 'regular' );

    }
    getDOM() {

        return this.renderer.domElement;

    }

}

export default RegularRenderer;