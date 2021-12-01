<template>
    <div class="main">
        <div class="mg-auto layer">
            <a-spin class="spin" tip = "Loading labels..." v-if="loadingSpin"/>
            <Nuxt />
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState({
            loadingSpin: state => state.loadingSpin
        })
    }
}
</script>

<style lang="scss">
.main {
    width: 100vw;
    height: 100%;
    background-color: rgb(245,245,245);
    padding: 20px 0;
    overflow-y: scroll;
    > .layer {
        width: 700px;
        min-height: 100%;
        background-color: white;
        padding: 35px 20px;
        border-radius: 16px;
    }
}

.mg-auto {
    margin: auto;
}

.spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>