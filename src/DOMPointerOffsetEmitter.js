/**
 * @callback PointerOffsetCallback
 * @param { Array< number, number > } pointerOffset
 */

class DOMPointerOffsetEmitter {

    /**
     * @param { HTMLElement } dom 
     */
    constructor( dom ) {

        this.dom = dom;
        
        this.pointerDownPosition = [ 0, 0 ];
        this.pointerMovePosition = [ 0, 0 ];
        this.offsetPosition = [ 0, 0 ];

        /**@type { PointerOffsetCallback }*/
        this.callBack;
        this._handleDOMEvents();

    }
    _handleDOMEvents() {

        let self = this;

        this.dom.addEventListener( 'mousedown', e => { self._onMouseDown( e ) } );
        this.dom.addEventListener( 'touchstart', e => { self._onTouchStart( e ) } );
        this.dom.addEventListener( 'mousemove', e => { self._onMouseMove( e ) } );
        this.dom.addEventListener( 'touchmove', e => { self._onTouchmove( e ) } );
        this.dom.addEventListener( 'mouseup', e => { self._onMouseUp( e ) } );
        this.dom.addEventListener( 'touchend', e => { self._onTouchEnd( e ) } );

    }
    /** @param { MouseEvent } e */
    _onMouseDown( e ) {

        this._setPointerDownPosition( [ e.offsetX, e.offsetY ] );

    }
    /**@param { TouchEvent } e */
    _onTouchStart( e ) {

        this._setPointerDownPosition( [ e.targetTouches[ 0 ].clientX, e.targetTouches[ 0 ].clientY ] );

    }
    /** @param { Array< number, number > } pos */
    _setPointerDownPosition( pos ) {

        this.pointerDownPosition = pos;

    }
    /** @param { MouseEvent } e */
    _onMouseMove( e ) {

        if( e.buttons === 1 ) {

            this._setPointerMovePosition( [ e.offsetX, e.offsetY ] );
            this._getOffsetPosition();
            this._emitPointerOffset();

        }

    }
    /**@param { TouchEvent } e */
    _onTouchmove( e ) {

        this._setPointerMovePosition( [ e.targetTouches[ 0 ].clientX, e.targetTouches[ 0 ].clientY ] );
        this._getOffsetPosition();
        this._emitPointerOffset();

    }
    /** @param { Array< number, number > } pos */
    _setPointerMovePosition( pos ) {

        this.pointerMovePosition = pos;

    }
    _getOffsetPosition() {

        this.offsetPosition = [

            this.pointerMovePosition[ 0 ] - this.pointerDownPosition[ 0 ],
            this.pointerMovePosition[ 1 ] - this.pointerDownPosition[ 1 ],
            
        ]

    }
    _emitPointerOffset() {

        this.callBack( this.offsetPosition );

    }
    _onMouseUp() {

        this._emitPointerOffsetWithZeroOffset();

    }
    _onTouchEnd() {

        this._emitPointerOffsetWithZeroOffset();

    }
    _emitPointerOffsetWithZeroOffset() {

        this.offsetPosition = [ 0, 0 ];
        this._emitPointerOffset();

    }
    /** @param { PointerOffsetCallback } callBack */
    addEventListener( callBack ) {

        this.callBack = callBack;

    }

}

export default DOMPointerOffsetEmitter;