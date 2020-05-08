import { Mesh, Color, SphereBufferGeometry } from "three";
import SkyDomeMaterial from "./SkyDomeMaterial";

const GEO = new SphereBufferGeometry( 4000, 32, 15 );

class SkyDome extends Mesh {

    /**
     * @param { Color } topColor 
     * @param { Color } groundColor 
     */
    constructor( topColor, groundColor ) {
        super( GEO, new SkyDomeMaterial( topColor, groundColor ) )
    }

}

export default SkyDome