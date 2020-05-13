import Vue from 'vue';
import JoyStickUI from './Joystick.vue';
import { Joystick } from '../JoystickObjectMovementControl';

export default class JoystickImp extends Joystick {
    constructor() {
        super();
        let mountDOM = document.createElement( 'div' );
        document.body.appendChild( mountDOM )
        new Vue( JoyStickUI ).$mount( mountDOM );
    }
};
