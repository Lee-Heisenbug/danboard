import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight } from 'three';
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
        this.renderer.shadowMapEnabled = true;
        this.camera = new PerspectiveCamera();
        this.camera.position.set( 10, 10, 10 );
        this.windowSizeAutoAdaptor = new WindowSizeAutoAdaptor( this.renderer, this.camera );
        this.contorl = new OrbitControls( this.camera, dom );
        this.contorl.screenSpacePanning = true;
        /**@type { Scene } */
        this.scene;

    }
    main() {
        
        let self = this;
        this._loadScene().then( ( scene ) => {

            self.scene = self._constructScene( scene );
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
    /**
     * @param { Scene } scene 
     */
    _constructScene( scene ) {

        scene.add( ...this._createLights() );

        scene.traverse( obj => {

            if( obj.isMesh ) {

                obj.castShadow = true;
                obj.receiveShadow = true;

            } else if( obj.isSpotLight ) {

                obj.castShadow = true;

            }
            
        } )

        return scene;

    }
    _createLights() {

        return [ new AmbientLight( '#ffffff', 1.5 ) ];

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