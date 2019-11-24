import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, WebGLRenderTarget, Vector4 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneModifier from './SceneModifier';
import sceneFile from '../export/danboard_low_poly.glb';
import SceneDepthRenderer from './SceneDepthRenderer';
import SceneNormalRenderer from './SceneNormalRenderer';
import SceneRegularRenderer from './SceneRegularRenderer';
import NormalRenderer from './NormalRenderer';

class App {

    /**
     * @param { HTMLCanvasElement } dom 
     */
    constructor( dom ) {

        this.dom = dom;
        this.renderer = this._createRenderer();
        this.scene;
        this.camera = this._createCamera();
        this.viewportRatio = new Vector2( 0.5, 0.5 );
        /**@type { Scene } */
        this.contorl = new OrbitControls( this.camera, dom );
        this.contorl.screenSpacePanning = true;

        this.sceneDepthRenderer = new SceneDepthRenderer();
        this.sceneDepthRenderer.setCamera( this.camera );
        this.sceneDepthRenderer.setRenderer( this.renderer );
        this.sceneNormalRenderer = new SceneNormalRenderer();
        this.sceneNormalRenderer.setCamera( this.camera );
        this.sceneNormalRenderer.setRenderer( this.renderer );
        this.sceneRegularRenderer = new SceneRegularRenderer();
        this.sceneRegularRenderer.setCamera( this.camera );
        this.sceneRegularRenderer.setRenderer( this.renderer );

        this.renderTarget = this._createRenderTarget();

        this.normalRenderer = new NormalRenderer();
        this.normalRenderer.setRenderer( this.renderer );
        this.normalRenderer.setTexture( this.renderTarget.texture );

        this.renderables = [

            this.sceneRegularRenderer,
            this.sceneDepthRenderer,
            this.sceneNormalRenderer,
            this.normalRenderer

        ]

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
    _createRenderTarget() {

        let vpSize = this._getViewportSize();
        let rt = new WebGLRenderTarget( vpSize.x, vpSize.y, { depthBuffer: true, stencilBuffer: false } );

        return rt;
        
    }
    main() {
        
        let self = this;
        this._loadScene().then( ( scene ) => {

            let sceneModifier = new SceneModifier( scene );
            self.scene = sceneModifier.getScene();

            self.sceneDepthRenderer.setScene( self.scene );
            self.sceneNormalRenderer.setScene( self.scene );
            self.sceneRegularRenderer.setScene( self.scene );

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

        let size = this._getWindowSize();

        this.renderer.setSize( size.x, size.y );
        this.camera.aspect = size.x / size.y;
        this.camera.updateProjectionMatrix();

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

        let self = this;

        this.renderer.setRenderTarget( this.renderTarget );
        this.renderer.clear( true, true, true );
        this.sceneRegularRenderer.render();
        this.renderer.setRenderTarget( null );

        this.renderables.forEach( ( r, index ) => {

            self._setViewport( index );
            r.render();

        } )

    }
    _setViewport( index ) {

        let size = this._getViewportSize();
        let position = this._getViewportPos( index );
        this.renderer.setViewport( position.x, position.y, size.x, size.y );

    }
    _getViewportSize() {

        let size = this._getWindowSize();
        size.multiply( this.viewportRatio );
        return size;

    }
    _getViewportPos( index ) {

        let viewportSize = this._getViewportSize();
        let pos = new Vector2();
        let count = new Vector2( parseInt( 1 / this.viewportRatio.x ), parseInt( 1 / this.viewportRatio.y ) );
        let indices = new Vector2( index % count.x, parseInt( index / count.x ) );

        pos.setX( indices.x * viewportSize.x );
        pos.setY( ( count.y - 1 - indices.y ) * viewportSize.y );

        return pos;

    }

}

export default App;