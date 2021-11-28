<template>
    <div class="main">
        <div class="mg-auto layer">
            <Nuxt />
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>

<style lang="scss">
.main {
    width: 100vw;
    height: 100%;
    background-color: rgb(245,245,245);
    padding: 20px 0;
    > .layer {
        width: 700px;
        height: 100%;
        background-color: white;
        padding: 35px 20px;
        border-radius: 16px;
    }
}

.mg-auto {
    margin: auto;
}

</style>