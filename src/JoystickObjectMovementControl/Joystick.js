import JoystickObserver from '../Joystick/JoystickObserver';

export default class Joystick {
    constructor() {
        /**@type { JoystickObserver } */
        this.observer = null
    }
    /**
     * @param { number } x 
     * @param { number } y 
     */
    setValue( x, y ) {
        this.observer.update( x, y );
    }
    /**
     * @param { JoystickObserver } observer 
     */
    setObserver( observer ) {
        this.observer = observer;
    }
};
