import NormalRendererMaterial from './NormalRendererMaterial';
import PlaneRender from './PlaneRender';

class NormalRenderer extends PlaneRender {

    constructor() {

        super();

    }
    _getPlaneMaterial() {

        return new NormalRendererMaterial();

    }
    setTexture( t ) {

        this.material.uniforms.map.value = t;

    }

}

export default NormalRenderer;