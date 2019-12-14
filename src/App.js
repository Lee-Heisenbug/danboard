import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import sceneFile from '../export/danboard_low_poly.glb';
import SceneModifier from './SceneModifier';
import SSAOGenerator from './SSAOGenerator';

import NormalRenderer from './NormalRenderer';

class App {

    /**
     * @param { HTMLCanvasElement } dom 
     */
    constructor( dom ) {

        this.dom = dom;
        this.renderer = this._createRenderer();
        /**@type { Scene } */
        this.scene;
        this.camera = this._createCamera();
        this.SSAOGenerator = new SSAOGenerator();
        this.SSAOGenerator.setCamera( this.camera );
        this.SSAOGenerator.setRenderer( this.renderer );

        this.normalRenderer = new NormalRenderer();
        this.normalRenderer.setRenderer( this.renderer );
        this.normalRenderer.setTexture( this.SSAOGenerator.getRenderResult() );

        new OrbitControls( this.camera, dom );
        this._autoResize();

    }
    _createRenderer() {

        let r = new WebGLRenderer( { canvas: this.dom } );
        r.gammaOutput = true;
        r.physicallyCorrectLights = true;
        r.shadowMapEnabled = true;
        r.setPixelRatio( window.devicePixelRatio );
        r.autoClear = false;

        return r;

    }
    _createCamera() {

        let cam = new PerspectiveCamera();
        cam.far = 50;
        cam.updateProjectionMatrix();
        cam.position.set( 10, 10, 10 );

        return cam;

    }
    main() {

        let self = this;
        this._loadScene().then( scene => {

            self._setScene( scene );
            self._changeObjectsMaterial();
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
     * @param { Scene } s 
     */
    _setScene( s ) {

        this.scene = s;
        this.SSAOGenerator.setScene( this.scene );

    }
    _changeObjectsMaterial() {

        let sceneModifier = new SceneModifier( this.scene );
        this.scene = sceneModifier.getScene();

    }
    _autoResize() {

        let self = this;

        this._resize();
        
        window.addEventListener( 'resize', () => {

            self._resize();

        } )

    }
    _resize() {

        let size = this._getWindowSize();

        this.renderer.setSize( size.x, size.y );
        this.camera.aspect = size.x / size.y;
        this.camera.updateProjectionMatrix();
        this.SSAOGenerator.setSize( [ size.x, size.y ] );

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

        this._renderSSAO();
        this._renderScene();

    }
    _renderSSAO() {

        this.SSAOGenerator.render();

    }
    _renderScene() {

        // this.renderer.render( this.scene, this.camera );
        this.normalRenderer.render();

    }

}

export default App;