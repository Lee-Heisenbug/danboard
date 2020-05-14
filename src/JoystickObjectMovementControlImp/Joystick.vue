<template>
    <div class="joystick" :style="joystickStyle" @touchmove.prevent="changeCoord" @touchend="resetCoord">
        <div class="stick" :style="[ stickStyle, stickPositionStyle ]"></div>
    </div>
</template>

<script>
import { Vector2 } from 'three'

export default {
    data() {
        return {
            size: 100,
            stickSize: 30,
            coord: [ 0, 0 ]
        }
    },
    computed: {
        joystickStyle() {
            
            return {
                width: this.size + 'px',
                height: this.size + 'px',
                borderRadius: this.size / 2 + 'px'
            }
        },
        stickStyle() {
            return {
                width: this.stickSize + 'px',
                height: this.stickSize + 'px',
                borderRadius: this.stickSize / 2 + 'px'
            }
        },
        halfSize() {
            return this.size/2;
        },
        halfStickSize() {
            return this.stickSize / 2;
        },
        stickPositionStyle() {

            const left = this.halfSize * this.coord[ 0 ] + this.halfSize;
            const top = - ( this.halfSize * this.coord[ 1 ] ) + this.halfSize;

            return {

                transform: `translate(${left - this.halfStickSize}px, ${top - this.halfStickSize}px)`

            }

        }
    },
    methods: {
        changeCoord( e ) {
            const touch = e.targetTouches[ 0 ];
            let offsetLeft = touch.clientX - this.$el.offsetLeft;
            let offsetTop = touch.clientY - this.$el.offsetTop;

            let DOMCoord = [ 0, 0 ];
            DOMCoord[ 0 ] = offsetLeft - this.halfSize;
            DOMCoord[ 1 ] = - offsetTop + this.halfSize;

            this.setCoord( this.normalize( this.clampCoord( DOMCoord ) ) )

        },
        /**
         * @param { [ number, number ] } coord
         * @returns { [ number, number ] }
         */
        clampCoord( coord ) {

            let coordLength = Math.pow( coord[ 0 ], 2 ) + Math.pow( coord[ 1 ], 2 );
            if( coordLength > Math.pow( this.halfSize, 2 ) ) {

                let v = new Vector2( coord[ 0 ], coord[ 1 ] );
                v.setLength( this.halfSize );

                return [ v.x, v.y ]

            } else {

                return coord;

            }

        },
        /**
         * @param { [ number, number ] } coord
         * @returns { [ number, number ] }
         */
        normalize( coord ) {

            coord[ 0 ] = coord[ 0 ] / this.halfSize;
            coord[ 1 ] = coord[ 1 ] / this.halfSize;
            return coord;

        },
        /**
         * @param { [ number, number ] } coord
         */
        setCoord( coord ) {
            this.coord = coord;
            this.$emit('change', [ this.coord[ 0 ], this.coord[ 1 ] ] );
        },
        resetCoord() {
            this.setCoord( [ 0, 0 ] )
        }

    }
}



</script>

<style lang="scss" scoped>
.joystick {
    position: fixed;
    left: 15px;
    bottom: 15px;
    background-color: rgba(165, 165, 165, 0.5);

    .stick {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        pointer-events: none;
    }
}
</style>