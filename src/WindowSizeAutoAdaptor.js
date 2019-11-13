import { WebGLRenderer, PerspectiveCamera } from 'three';

class WindowSizeAutoAdaptor {

    /**
     * @param { WebGLRenderer } renderer 
     * @param { PerspectiveCamera } camera 
     */
    constructor( renderer, camera ) {

        this.renderer = renderer;
        this.camera = camera;

    }
    autoResize() {

        let self = this;

        this.resize();
        
        window.addEventListener( 'resize', () => {

            self.resize();

        } )

    }
    resize() {

        let windowSize = this._getWindowSize();
        this.renderer.setSize( windowSize[ 0 ], windowSize[ 1 ] );
        this.camera.aspect = windowSize[ 0 ] / windowSize[ 1 ];
        this.camera.updateProjectionMatrix();

    }
    _getWindowSize() {

        return [ window.innerWidth, window.innerHeight ];

    }

}

export default WindowSizeAutoAdaptor;