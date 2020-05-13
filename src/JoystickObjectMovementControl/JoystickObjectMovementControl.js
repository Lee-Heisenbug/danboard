import Joystick from "./Joystick";
import JoystickObjectMover from './JoystickObjectMover';

export default class JoystickObjectMovementControl {
    
    /**
     * @param { Joystick } joystick 
     * @param { JoystickObjectMover } joystickObjectMover 
     */
    constructor( joystick, joystickObjectMover ) {

        joystick.onChanged( ( x, y ) => {

            joystickObjectMover.moveToward( x, y );

        } )
    }
};
