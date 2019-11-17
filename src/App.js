import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneModifier from './SceneModifier';
import sceneFile from '../export/danboard_low_poly.glb';
import SceneDepthRenderer from './SceneDepthRenderer';

class App {

    /**
     * @param { HTMLElement } dom 
     */
    constructor( dom ) {

        this.dom = dom;
        this.sceneDepthRenderer = new SceneDepthRenderer();
        this.renderer = new WebGLRenderer();
        this.renderer.gammaOutput = true;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMapEnabled = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.camera = new PerspectiveCamera();
        this.camera.far = 50;
        this.camera.updateProjectionMatrix();
        this.camera.position.set( 10, 10, 10 );
        this.contorl = new OrbitControls( this.camera, dom );
        this.contorl.screenSpacePanning = true;
        /**@type { Scene } */
        this.scene;
        this.dom.append( this.sceneDepthRenderer.getDOM() );
        this.dom.append( this.renderer.domElement );

    }
    main() {
        
        let self = this;
        this._loadScene().then( ( scene ) => {

            let sceneModifier = new SceneModifier( scene );
            self.scene = sceneModifier.getScene();
            self._autoResize();
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
    _autoResize() {

        let self = this;

        this._resize();
        
        window.addEventListener( 'resize', () => {

            self._resize();

        } )

    }
    _resize() {

        let ratio = new Vector2( 1.0, 0.5 );
        let size = this._getWindowSize();
        size.multiply( ratio );

        this.renderer.setSize( size.x, size.y );
        this.camera.aspect = size.x / size.y;
        this.camera.updateProjectionMatrix();
        this.sceneDepthRenderer.setSize( size );

    }
    _getWindowSize() {

        return new Vector2( window.innerWidth, window.innerHeight );

    }
    _autoRender() {

        let self = this;

        this._render();
        requestAnimationFrame( () => {

            self._autoRender();

        } )

    }
    _render() {

        this.sceneDepthRenderer.render( this.scene, this.camera );
        this.renderer.render( this.scene, this.camera );

    }

}

export default App;