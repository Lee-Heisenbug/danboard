import SceneDepthMaterial from './SceneDepthMaterial';
import SceneRenderer from './SceneRenderer';

class SceneDepthRenderer extends SceneRenderer {

    constructor() {

        super();

    }
    _getSceneMaterial() {

        return new SceneDepthMaterial();

    }

}

export default SceneDepthRenderer;