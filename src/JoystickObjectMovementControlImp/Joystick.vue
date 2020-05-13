<template>
    <div class="joystick" :style="'width:' + size + 'px;' + 'height:' + size + 'px;'">
        <div class="stick"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            size: 40,
            stickSize: 10
        }
    }
}
</script>

<style scoped>
.joystick {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
}
</style>