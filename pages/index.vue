<template>
  <div>
    <h1>Form Khảo sát</h1>
    <div class="list-image" v-if="imageList">
      <div 
        class="image"
        v-for="image in imageList"
        :key="image._id"
      >
        <h3>Image ID: {{image._id}}</h3>
        <img :src="image.flickr_url" />
        <div class="captions">
          <template v-for="caption in image.captions">
            <a-radio :key="caption._id">
              {{caption.caption}}
            </a-radio>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import {cloneDeep} from 'lodash';
export default {
  layout: 'default',
  data() {
    return {
      imageList: null,
    }
  },
  created() {
    this.loadRecords();
  },
  methods: {
    ...mapActions({
      getVieCaption: 'getVieCaption'
    }),
    loadRecords: function() {
      this.$store.commit('setLoadingSpin', true);
      this.getVieCaption().then(res => {
        this.imageList = cloneDeep(res.imageIdLists);
        this.$store.commit('setLoadingSpin', false);
      }).catch(err => {
        this.$store.commit('setLoadingSpin', false);
        this.$notification.error({
          key: `Error`,
          message: 'Error',
          description: err
        })
      })
    }
  }
}
</script>
<style lang="scss">
.list-image{
  .image {
    margin-top: 20px;
  }
}
</style>
