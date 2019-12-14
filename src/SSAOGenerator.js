import { WebGLRenderer, Scene, Camera, WebGLRenderTarget, HalfFloatType, Texture } from 'three';
import { SceneDepthRenderer, SceneNormalRenderer } from './SceneRenderers';
import KernelRotationMapGenerater from './KernelRotationMapGenerater';
import SSAORenderer from './SSAORenderer';
import Renderable from './Renderable';

class SSAOGenerator {

    constructor() {

        /**@type { Scene } */
        this.scene;
        /**@type { Camera } */
        this.camera;
        /**@type { WebGLRenderer }*/
        this.renderer;
        this.size = [ 64, 64 ];

        this.sceneDepthRenderer = new SceneDepthRenderer();
        this.sceneNormalRenderer = new SceneNormalRenderer();
        this.ssaoRenderer = new SSAORenderer();

        this.scenePositionRenderTarget = this._createRenderTarget();
        this.sceneNormalRenderTarget = this._createRenderTarget();
        this.ssaoRenderTarget = this._createRenderTarget();

        this.kernalMapGenerater = new KernelRotationMapGenerater();
        this.ssaoRenderer.setNoiseMap( this.kernalMapGenerater.getMap() );
        this.ssaoRenderer.setScenePositionMap( this.scenePositionRenderTarget.texture );
        this.ssaoRenderer.setSceneNormalMap( this.sceneNormalRenderTarget.texture );

    }
    /**@param { Scene } s */
    setScene( s ) {

        this.scene = s;
        this.sceneDepthRenderer.setScene( s );
        this.sceneNormalRenderer.setScene( s );

    }
    /**@param { Camera } c */
    setCamera( c ) {
        
        this.camera = c;
        this.sceneDepthRenderer.setCamera( this.camera );
        this.sceneNormalRenderer.setCamera( this.camera );
        this.ssaoRenderer.setProjectionMatrix( this.camera.projectionMatrix );

    }
    /**@param { WebGLRenderer } */
    setRenderer( r ) {

        this.renderer = r;
        this.sceneDepthRenderer.setRenderer( this.renderer );
        this.sceneNormalRenderer.setRenderer( this.renderer );
        this.ssaoRenderer.setRenderer( this.renderer );

    }
    _createRenderTarget() {

        let rt = new WebGLRenderTarget( this.size[ 0 ], this.size[ 1 ], { depthBuffer: true, stencilBuffer: false, type: HalfFloatType } );

        return rt;
        
    }
    render() {

        this._renderToRenderTarget( this.scenePositionRenderTarget, this.sceneDepthRenderer );
        this._renderToRenderTarget( this.sceneNormalRenderTarget, this.sceneNormalRenderer );
        this._renderToRenderTarget( this.ssaoRenderTarget, this.ssaoRenderer );

    }
    /**
     * @param { WebGLRenderTarget } rt
     * @param { Renderable } renderable
     */
    _renderToRenderTarget( rt, renderable ) {

        this.renderer.setRenderTarget( rt );
        this.renderer.clear( true, true, true );
        renderable.render();
        this.renderer.setRenderTarget( null );

    }
    /**@returns { Texture } */
    getRenderResult() {

        return this.ssaoRenderTarget.texture;

    }
    /**
     * @param { Array< number > } s 
     */
    setSize( s ) {

        this.size = s;
        this.sceneNormalRenderTarget.setSize( this.size[ 0 ], this.size[ 1 ] );
        this.scenePositionRenderTarget.setSize( this.size[ 0 ], this.size[ 1 ] );
        this.ssaoRenderTarget.setSize( this.size[ 0 ], this.size[ 1 ] );

    }

}

export default SSAOGenerator;