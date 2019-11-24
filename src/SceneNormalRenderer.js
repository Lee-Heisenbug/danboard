import SceneNormalMaterial from './SceneNormalMaterial';
import SceneRenderer from './SceneRenderer';

class SceneNormalRenderer extends SceneRenderer {

    constructor() {

        super();

    }
    _getSceneMaterial() {

        return new SceneNormalMaterial();

    }

}

export default SceneNormalRenderer;