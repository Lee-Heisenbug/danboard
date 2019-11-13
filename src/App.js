import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WindowSizeAutoAdaptor from './WindowSizeAutoAdaptor';
import sceneFile from '../export/danboard_low_poly.glb';

class App {

    /**
     * @param { HTMLCanvasElement } dom 
     */
    constructor( dom ) {

        this.renderer = new WebGLRenderer( { canvas: dom } );
        this.renderer.gammaOutput = true;
        this.renderer.physicallyCorrectLights = true;
        this.camera = new PerspectiveCamera();
        this.camera.position.set( 10, 10, 10 );
        this.windowSizeAutoAdaptor = new WindowSizeAutoAdaptor( this.renderer, this.camera );
        this.contorl = new OrbitControls( this.camera, dom );
        /**@type { Scene } */
        this.scene;

    }
    main() {
        
        let self = this;
        this._loadScene().then( ( scene ) => {

            self.scene = scene;
            self.windowSizeAutoAdaptor.autoResize();
            self._autoRender();

        } )

    }
    _loadScene() {

        let loader = new GLTFLoader();

        return new Promise( ( res ) => {

            loader.load( sceneFile, ( gltf ) => {

                res( gltf.scene );

            } )

        } )
        
    }
    _autoRender() {

        let self = this;

        this._render();
        requestAnimationFrame( () => {

            self._autoRender();

        } )

    }
    _render() {

        this.renderer.render( this.scene, this.camera );

    }

}

export default App;