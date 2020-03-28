import ObjectsDirectionControl from '../src/ObjectsDirectionControl';
import { Object3D, Vector2, Vector3, Matrix3 } from 'three';

test( 'move objects', () => {

    let osdc = new ObjectsDirectionControl();
    let objs = [ new Object3D, new Object3D ];
    osdc.setObjects( objs );
    
    let dir2D = new Vector2( 1, 1 )
    dir2D.normalize();

    osdc.setDirection( dir2D );
    
    objs.forEach( ( obj ) => {

        obj.updateMatrix();

        let rotationMatrix = new Matrix3();
        rotationMatrix.setFromMatrix4( obj.matrix );

        let dir = new Vector3( 0, 0, 1 );

        dir.applyMatrix3( rotationMatrix );

        dir.normalize();

        expectDirsAreEqual( dir, new Vector3( dir2D.x, 0, -dir2D.y ) );

    } )

} );

/**
 * @param { Vector3 } dir1 
 * @param { Vector3 } dir2 
 */
function expectDirsAreEqual( dir1, dir2 ) {

    expect( Math.abs( dir1.x - dir2.x ) ).toBeLessThan( 0.000000000000001 );
    expect( Math.abs( dir1.y - dir2.y ) ).toBeLessThan( 0.000000000000001 );
    expect( Math.abs( dir1.z - dir2.z ) ).toBeLessThan( 0.000000000000001 );

}