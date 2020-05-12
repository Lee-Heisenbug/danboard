import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, Clock, AnimationMixer, Vector3, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import sceneFile from '../export/danboard_low_poly.glb';
import SceneModifier from './SceneModifier';
import SSAOGenerator from './SSAOGenerator';
import DanboardApp from './DanboardApp';
import DOMPointerOffsetEmitter from './DOMPointerOffsetEmitter';
import MovementAnimationControl from './MovementAnimationControl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CameraRelativeObjectMovementControl from './CameraRelativeObjectMovementControl';

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
        /**@type { CameraRelativeObjectMovementControl } */
        this.movementControl;
        this.camera = this._createCamera();

        this.animationMixer = new AnimationMixer();
        this.idleClip;
        this.idleAction;
        this.walkClip;
        this.walkAction;
        this.runClip;
        this.runAction;
        /**@type { MovementAnimationControl } */
        this.movementAnimationControl = new MovementAnimationControl();

        this.SSAOGenerator = new SSAOGenerator();
        this.SSAOGenerator.setCamera( this.camera );
        this.SSAOGenerator.setRenderer( this.renderer );
        this.velocity = new Vector2();
        this.domPointerOffsetEmitter = new DOMPointerOffsetEmitter( this.dom );
        this._loadedModel;
        this.animation;
        this.clock = new Clock();

        this.camera.lookAt( new Vector3( 0, 3.5, 0 ) );
        this._autoResize();
        this._handleEvents();
        this.contorls = new OrbitControls( this.camera, dom );
        this.contorls.maxPolarAngle = Math.PI * 3 / 4
        this.contorls.minPolarAngle = Math.PI / 4
        this.contorls.maxDistance = 20

    }
    _handleEvents() {

        let self = this;

        this.domPointerOffsetEmitter.addEventListener( offset => {

            let velocityFactor = self._getVelocityFactor( offset );

            console.log( velocityFactor );
            self.movementControl.move( velocityFactor[ 0 ], velocityFactor[ 1 ] )
            self.movementAnimationControl.setMoveFactor( new Vector2( velocityFactor[ 0 ], velocityFactor[ 1 ] ).length() );

        } );

    }
    /**@param { Array< number, number > } offset */
    _getVelocityFactor( offset ) {

        const RANGE = 200;
        let v = new Vector2( offset[ 0 ], offset[ 1 ] );
        v.clampLength( 0, RANGE );

        v.divideScalar( RANGE );

        return [ v.x, -v.y ];

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
        cam.far = 5000;
        cam.updateProjectionMatrix();
        cam.position.set( 0, 12, 15 );

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

            self.contorls.target = self.danboard.position;
            self.movementControl = new CameraRelativeObjectMovementControl( self.camera, self.danboard );
            self.movementControl.setSpeed( 5 );

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

            self.idleClip = gltf.animations[ 2 ];
            self.walkClip = gltf.animations[ 1 ];
            self.runClip = gltf.animations[ 0 ];

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
        this.scene.background = new Color( '#fff' );
        this.SSAOGenerator.setScene( this.scene );

    }
    _playAnimation() {

        let self = this;
        this.animationMixer = new AnimationMixer( this.scene );
        this.idleAction = this.animationMixer.clipAction( this.idleClip );
        this.walkAction = this.animationMixer.clipAction( this.walkClip );
        this.runAction = this.animationMixer.clipAction( this.runClip );

        this.idleAction.play();
        this.walkAction.play();
        this.runAction.play();

        this.movementAnimationControl.setIdleAnimation( this.idleAction );
        this.movementAnimationControl.setWalkAnimation( this.walkAction );
        this.movementAnimationControl.setRunAnimation( this.runAction );

        this.movementAnimationControl.setMoveFactor( 0 );
        this.movementAnimationControl.updateThreshold();

        
        function autoUpdateMixer() {
            
            let delta = self.clock.getDelta();
            self.animationMixer.update( delta );
            self.movementControl.updateByTime( delta );
            self.contorls.update();
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