/**
 * @callback JoystickChangedCallback
 * @param { number } x
 * @param { number } y
 */
export default class Joystick {
    constructor() {
        /**@type { JoystickChangedCallback } */
        this.joystickChangedCallback = () => {}
    }
    /**
     * @param { JoystickChangedCallback } cb 
     */
    onChanged( cb ) {
        this.joystickChangedCallback = cb
    }
};
