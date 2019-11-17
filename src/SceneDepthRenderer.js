import SceneDepthMaterial from './SceneDepthMaterial';
import SceneRenderer from './SceneRenderer';

class SceneDepthRenderer extends SceneRenderer {

    constructor() {

        super();

    }
    _decoDOM() {

        this.renderer.domElement.classList.add( 'scene-depth' );

    }
    _getSceneMaterial() {

        return new SceneDepthMaterial();

    }

}

export default SceneDepthRenderer;