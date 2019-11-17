import SceneNormalMaterial from './SceneNormalMaterial';
import SceneRenderer from './SceneRenderer';

class SceneNormalRenderer extends SceneRenderer {

    constructor() {

        super();

    }
    _decoDOM() {

        this.renderer.domElement.classList.add( 'scene-normal' );

    }
    _getSceneMaterial() {

        return new SceneNormalMaterial();

    }

}

export default SceneNormalRenderer;