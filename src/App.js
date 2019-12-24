import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, Clock, AnimationMixer, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import sceneFile from '../export/danboard_low_poly.glb';
import SceneModifier from './SceneModifier';
import SSAOGenerator from './SSAOGenerator';
import DanboardApp from './DanboardApp';
import MovementControl from './MovementControl';
import DOMPointerOffsetEmitter from './DOMPointerOffsetEmitter';

class App {

    /**
     * @param { HTMLCanvasElement } dom 
     */
    constructor( dom ) {

        this.dom = dom;
        this.renderer = this._createRenderer();
        /**@type { Scene } */
        this.scene;
        this.danboard;
        this.movementControl = new MovementControl();
        this.camera = this._createCamera();
        this.SSAOGenerator = new SSAOGenerator();
        this.SSAOGenerator.setCamera( this.camera );
        this.SSAOGenerator.setRenderer( this.renderer );
        this.velocity = new Vector2();
        this.domPointerOffsetEmitter = new DOMPointerOffsetEmitter( this.dom );
        this._loadedModel;
        this.animation;
        this.clock = new Clock();

        this.camera.lookAt( new Vector3( 0, 3, 0 ) );
        this._autoResize();
        this._handleEvents();

    }
    _handleEvents() {

        let self = this;

        this.domPointerOffsetEmitter.addEventListener( offset => {

            let velocity = [ offset[ 0 ] / 100, -offset[ 1 ] / 100 ];
            this.movementControl.move( velocity );
            this.camera.position.x += velocity[ 0 ];
            this.camera.position.z -= velocity[ 1 ];

        } );

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
        cam.position.set( 0, 8, 10 );

        return cam;

    }
    main() {

        let self = this;
        Promise.all( [

            self._prepareDanboard(),
            self._prepareScene(),
            self._prepareAnimation()

        ] ).then( () => {

            self._playAnimation();
            self._autoRender();

        } );

    }
    _prepareDanboard() {

        let self = this;

        return this._loadGLTFModel().then( gltf => {

            self.danboard = gltf.scene.getObjectByName( "Armature" );
            self.movementControl.setObject( self.danboard );

        } )

    }
    _prepareScene() {

        let self = this;

        return this._loadGLTFModel().then( gltf => {

            self._setScene( gltf.scene );
            self._modifyScene();

        } );

    }
    _prepareAnimation() {

        let self = this;

        return this._loadGLTFModel().then( gltf => {

            self._setAnimation( gltf.animations[ 2 ] );

        } )

    }
    _loadGLTFModel() {

        if( !this._loadedModel ) {

            this._loadedModel = new Promise( ( res, rej ) => {

                let loader = new GLTFLoader();

                loader.load( sceneFile, ( gltf ) => {

                    res( gltf );
    
                } )

            } )

        }

        return this._loadedModel;
        
    }
    _setAnimation( a ) {

        this.animation = a;

    }
    /**
     * @param { Scene } s 
     */
    _setScene( s ) {

        this.scene = s;
        this.SSAOGenerator.setScene( this.scene );

    }
    _playAnimation() {

        let self = this;
        let mixer = new AnimationMixer( this.scene );
        let action = mixer.clipAction( this.animation );
        action.play();

        function autoUpdateMixer() {

            mixer.update( self.clock.getDelta() );

            requestAnimationFrame( autoUpdateMixer );

        }

        autoUpdateMixer();

    }
    _modifyScene() {

        let sceneModifier = new SceneModifier( this.scene );
        sceneModifier.setSSAO( this.SSAOGenerator.getRenderResult() );
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

        this.renderer.render( this.scene, this.camera );

    }

}

Object.assign( App.prototype, DanboardApp.prototype, {

    /** @param { Array< number, number > } moveVector */
    move( moveVector ) {

        this.movementControl.move( moveVector );

    }
    
} );

export default App;