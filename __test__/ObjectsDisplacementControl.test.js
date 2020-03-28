import ObjectsDisplacementControl from '../src/ObjectsDisplacementControl';
import { Object3D, Vector2 } from 'three';

test( 'move objects', () => {

    let osdc = new ObjectsDisplacementControl();
    let objs = [ new Object3D, new Object3D ];
    let originPositions = objs.map( obj => obj.position.clone() );
    
    osdc.setObjects( objs );
    osdc.setMaxVelocity( new Vector2( 7, 7 ) );
    osdc.setFactor( new Vector2( 0.5, 0.3 ) );
    
    osdc.moveByTime( 1 );
    objs.forEach( ( obj, index ) => {

        let offset = obj.position.clone();
        offset.sub( originPositions[ index ] );

        expect( offset.x ).toBe( 7 * 0.5 * 1 );
        expect( offset.z ).toBe( - 7 * 0.3 * 1 );
        expect( offset.y ).toBe( 0 );

    } )

} );