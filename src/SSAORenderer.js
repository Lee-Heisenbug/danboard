import SSAOKernel from './SSAOKernel';
import { Texture, Matrix4 } from 'three';
import PlaneRender from './PlaneRender';
import SSAOMaterial from './SSAOMaterial';

class SSAORenderer extends PlaneRender {

    constructor() {

        super();
        this.kernel = new SSAOKernel();
        this._setKernel();

    }
    _getPlaneMaterial() {

        return new SSAOMaterial();;

    }
    _setKernel() {

        this.material.setSamples( this.kernel.samples );

    }
    /**
     * @param { Texture } t 
     */
    setScenePositionMap( t ) {

        this.material.setPositionMap( t );

    }
    /**
     * @param { Texture }
     */
    setSceneNormalMap( t ) {

        this.material.setNormalMap( t );

    }
    setNoiseMap( t ) {

        this.material.setNoiseMap( t );

    }
    /**
     * @param { Matrix4 } m 
     */
    setProjectionMatrix( m ) {

        this.material.setProjectionMatrix( m );

    }

}

export default SSAORenderer;