<template>
    <div>
        <h1>Tool gán dữ liệu</h1>
        <div class="image" v-if="image">
            <img :src="image.flickr_url" style="width: 100%"/>
        </div>
        <div class="caption" v-if="captions">
            <div v-for="(caption, index) in captions" :key="caption.id">
                <p>Label{{index + 1}}: {{caption.caption}}</p>
            </div>
        </div>
        <div class="newcaption" v-if="newcaptions">
            <h2>Gán dữ liệu</h2>
            <template v-for="(newcap, index) in newcaptions" >
                <a-input 
                    :key="index"
                    :placeholder="`Label ${index + 1}`"
                    v-model="newcap.caption"
                    style="margin: 15px 0"
                />
            </template>
        </div>
        <div class="submit" v-if="newcaptions">
            <a-button type="primary" @click="submit">Save & Next</a-button>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import {cloneDeep} from 'lodash'
export default {
    data() {
        return {
            image: null,
            captions: null,
            newcaptions: null
        }
    },
    created() {
        this.loadRecords();
    },
    methods: {
        ...mapActions({
            loadLabels: 'loadLabels',
            createVieCaption: 'createVieCaption',
            saveVieCaption: 'saveVieCaption'
        }),
        loadRecords: function() {
            this.loadLabels().then(res => {
                this.image = cloneDeep(res.image);
                this.captions = cloneDeep(res.captions);
                this.createVieCaption(res.image.image_id).then(res => {
                    this.newcaptions = cloneDeep(res);
                })
            })
        },
        submit: function() {
            let check = true;
            for (let i = 0; i < 5; i++) {
                if (this.newcaptions[i].caption === '') {
                    check = false;
                    this.$notification.error({
                        key: `Err label ${i}`,
                        message: 'Error',
                        description: `Caption in label ${i+1} is empty`
                    })
                }
            }
            if (check) {
                this.saveVieCaption(this.newcaptions).then(res => {
                    this.$message.success(res);
                    this.loadRecords();
                }).catch(err => {
                    this.$message.error(err);
                    this.loadRecords();
                })
            }
        }
    }
}
</script>

<style lang="scss">
.caption {
    margin-top: 20px;
    p {
        font-family: 'Segoe UI', sans-serif;
        font-size: 16px;
        font-weight: 500;
    }
}

.submit {
    margin-top: 15px;
}
</style>