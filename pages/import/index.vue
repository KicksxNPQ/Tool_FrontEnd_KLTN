<template>
    <div style="position: relative">
        <h1>Tool gán dữ liệu</h1>
        <h2>Image ID: <span v-if="captions">{{captions[0].image_id}}</span></h2>
        <div class="image" v-if="image">
            <img :src="`http://images.cocodataset.org/train2017/${convertImage(captions[0].image_id)}.jpg`" style="width: 100%"/>
        </div> 
        <div v-if="image">
            <p>Try the following links if the image isn't show</p>
            <a :href="`http://images.cocodataset.org/train2017/${convertImage(captions[0].image_id)}.jpg`" target="_blank">
                http://images.cocodataset.org/train2017/{{convertImage(captions[0].image_id)}}.jpg
            </a>
            <a :href="image.flickr_url" target="_blank">{{image.flickr_url}}</a>
        </div>
        <div class="caption" v-if="captions">
            <div v-for="(caption, index) in captions" :key="caption.id">
                <p>Label {{index + 1}}: {{caption.caption}}</p>
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
            <a-button type="primary" @click="submit" :loading="saveLoading">Save & Next</a-button>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import {cloneDeep} from 'lodash'
export default {
    data() {
        return {
            saveLoading: false,
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
            this.$store.commit('setLoadingSpin', true);
            this.image = null;
            this.captions = null;
            this.newcaptions = null
            this.loadLabels().then(res => {
                this.$store.commit('setLoadingSpin', false);
                this.image = cloneDeep(res.image);
                this.captions = cloneDeep(res.captions);
                this.createVieCaption(res.image.image_id).then(res => {
                    this.newcaptions = cloneDeep(res);
                })
            })
        },
        convertImage: function(image_id) {
            let str = image_id.toString();
            while(str.length < 12) str = "0" + str;
            return str;
        },
        countWords: function(str) {
            return str.trim().split(' ').filter((ele) => ele !== '').length;
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
                for (let i = 0; i < 5; i++) {
                    if (this.countWords(this.newcaptions[i].caption) < 10) {
                        check = false;
                        this.$notification.error({
                            key: `Err label ${i}`,
                            message: 'Error',
                            description: `Caption in label ${i+1} must be at least 10 words`
                        })
                    }
                }
            }
            if (check) {
                this.saveLoading = true;
                this.saveVieCaption(this.newcaptions).then(res => {
                    this.saveLoading = false;
                    this.$message.success(res);
                    this.loadRecords();
                }).catch(err => {
                    this.saveLoading = false;
                    this.$message.error(err);
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