import { AnimationAction } from 'three';

class MovementAnimationControl {

    constructor() {

        /**@type { AnimationAction } */
        this.idleAnimation;
        /**@type { AnimationAction } */
        this.walkAnimation;
        /**@type { AnimationAction } */
        this.runAnimation;
        /**@type { number } */
        this.moveFactor = 0;
        this.walkThreshold = 0.3;

    }
    /**@param { AnimationAction } a */
    setIdleAnimation( a ) {

        this.idleAnimation = a;

    }
    /**@param { AnimationAction } a */
    setWalkAnimation( a ) {

        this.walkAnimation = a;

    }
    /**@param { AnimationAction } a */
    setRunAnimation( a ) {

        this.runAnimation = a;

    }
    updateThreshold() {

        let idleDur = this.idleAnimation.getClip().duration;
        let walkDur = this.walkAnimation.getClip().duration;
        let runDur = this.runAnimation.getClip().duration;

        this.walkThreshold = ( idleDur - walkDur ) / ( idleDur - runDur );

    }
    /**@param { number } f */
    setMoveFactor( f ) {

        this.moveFactor = f;
        this._updateAnimationTimeScale();
        this._updateAnimationWeight();

    }
    _updateAnimationTimeScale() {

        let idleDur = this.idleAnimation.getClip().duration;
        let walkDur = this.walkAnimation.getClip().duration;
        let runDur = this.runAnimation.getClip().duration;

        let offsetDur = idleDur - runDur;
        let duration = offsetDur * ( 1.0 - this.moveFactor ) + runDur;

        this.idleAnimation.timeScale = idleDur / duration;
        this.walkAnimation.timeScale = walkDur / duration;
        this.runAnimation.timeScale = runDur / duration;
        // console.log( this.idleAnimation.timeScale, this.walkAnimation.timeScale, this.runAnimation.timeScale );

    }
    _updateAnimationWeight() {

        let weight;

        if ( this.moveFactor > this.walkThreshold ) {

            this.idleAnimation.weight = 0;
            
            weight = ( this.moveFactor - this.walkThreshold ) / ( 1.0 - this.walkThreshold );
            this._smoothActionsWeight( this.walkAnimation, this.runAnimation, weight );

        } else if( this.moveFactor > 0 ) {

            this.runAnimation.weight = 0;

            weight = ( this.moveFactor - 0 ) / ( this.walkThreshold - 0 );
            this._smoothActionsWeight( this.idleAnimation, this.walkAnimation, weight );

        } else {

            this.idleAnimation.weight = 1;
            this.walkAnimation.weight = 0;
            this.runAnimation.weight = 0;

        }

    }
    /**
     * 
     * @param { AnimationAction } preAction 
     * @param { AnimationAction } postAction 
     * @param { AnimationAction } preActionWeight 
     */
    _smoothActionsWeight( preAction, postAction, postActionWeight ) {

        preAction.weight = 1.0 - postActionWeight;
        postAction.weight = postActionWeight;

    }

}

export default MovementAnimationControl;