<template>
  <div>
    <h1>Form Khảo sát</h1>
    <div class="label" v-if="form" ref="name">
      <label>Full name: <span class="required">*</span></label>
      <a-input placeholder="Full name" v-model="form.name" />
      <label class="error" v-if="errors && errors.name">{{errors.name ? errors.name[0] : ""}}</label>
    </div>  
    <div class="label" v-if="form" ref="studentID">
      <label>Student ID: <span class="required">*</span></label>
      <a-input placeholder="Student ID" v-model="form.studentID" />  
      <label class="error" v-if="errors && errors.studentID" >{{errors.studentID[0]}}</label>
    </div>
    
    <div class="list-image" v-if="imageList" ref="listImage">
      <div 
        class="image"
        v-for="(image,i) in imageList"
        :key="image._id"
      >
        <h3>Image ID: {{image._id}}</h3>
        <img :src="image.flickr_url" />
        <div class="captions" >
            <div v-for="(caption, j) in image.captions" :key="caption._id" class="recommend" >
              <a-checkbox v-if ="caption.open !== undefined" :checked="imageList[i].captions[j].open" @change="changeCheckbox($event,i,j)">
                {{caption.caption}}
              </a-checkbox>
              <a-input v-if="imageList[i].captions[j].open" :placeholder="`Label ${j}`" v-model="imageList[i].captions[j].recommendSentence"/>
              <label class="error" v-if="imageList[i].captions[j].open && imageList[i].captions[j].error">{{imageList[i].captions[j].errorLabel}}</label>
            </div>
        </div>
      </div>
    </div>
    <div class="submit" v-if="imageList">
      <a-button type="primary" @click="submit" :loading="saveLoading">Submit</a-button>
    </div>
  </div>
</template>

<script>

const constraint = {
  name: {
    presence: {
      allowEmpty: false
    }
  },
  studentID: {
    presence: {
      allowEmpty: false
    }
  }
}

import {mapActions, mapState} from 'vuex';
import {cloneDeep} from 'lodash';
import validate from '~/utils/validate'
export default {
  layout: 'default',
  data() {
    return {
      imageList: null,
      form: null,
      saveLoading: false,
      errors: {},
    }
  },
  beforeMount() {
    this.loadRecords();
  },
  beforeUpdate() {
    this.captionRefs = [];
  },
  methods: {
    ...mapActions({
      getVieCaption: 'getVieCaption',
      saveRecCaption: 'saveRecCaption'
    }),
    loadRecords: function() {
      this.$store.commit('setLoadingSpin', true);
      this.getVieCaption().then(res => {
        let imageList = cloneDeep(res.imageIdLists);
        for (let i = 0; i < imageList.length; i++) 
          for (let j = 0; j < imageList[i].captions.length; j++){
            imageList[i].captions[j].open = false;
            imageList[i].captions[j].recommendSentence = "";
            imageList[i].captions[j].error = false;
            imageList[i].captions[j].errorLabel = "";
          }
        this.imageList = cloneDeep(imageList);
        this.form = {
          name: "",
          studentID: ""
        }
        this.$store.commit('setLoadingSpin', false);
      }).catch(err => {
        this.$store.commit('setLoadingSpin', false);
        this.$notification.error({
          key: `Error`,
          message: 'Error',
          description: err
        })
      })
    },
    changeCheckbox: function($event,i, j) {
      this.imageList[i].captions[j].open = $event.target.checked;
    },
    scrollToError: function(errors) {
      this.$nextTick(() => {
        for (const key of Object.keys(errors)) {
          this.$refs[key].scrollIntoView({behavior: 'smooth'});
          return;
        }
      })
    },
    countWords: function(str) {
      return str.trim().split(' ').filter((ele) => ele !== '').length;
    },
    submit: function() {
        this.saveLoading = true;
        var errors = validate(this.form, constraint);
        if (errors) {
          this.errors = errors;
          this.scrollToError(errors);
          this.saveLoading = false;
          return;
        }
        for (let index = 0; index < this.imageList.length; index++) {
          for (let j = 0; j < this.imageList[index].captions.length; j++) {
            if (this.imageList[index].captions[j].open) {
              let sent = this.imageList[index].captions[j].recommendSentence;
              console.log(sent);
              if (sent.length === 0) {
                this.imageList[index].captions[j].error = true;
                this.imageList[index].captions[j].errorLabel = "Sentence isn't empty."
                continue;
              }
              if (this.countWords(sent) < 10) {
                this.imageList[index].captions[j].error = true;
                this.imageList[index].captions[j].errorLabel = "The quantity of word in sentence is not less than 10."
                continue;
              }
              this.imageList[index].captions[j].error = false;
              this.imageList[index].captions[j].errorLabel = "";
            }
          }
        }
        this.$nextTick(() => {
          for (let index = 0; index < this.imageList.length; index++) {
            for (let j = 0; j < this.imageList[index].captions.length; j++) {
              if (this.imageList[index].captions[j].open) {
                if (this.imageList[index].captions[j].error) {
                    console.log(this.$refs.listImage.children[index].children[2].children[j]);
                    this.$refs.listImage.children[index].children[2].children[j].scrollIntoView();
                  return;
                }
              }
            }
          }
          let data = cloneDeep(this.form);
          data.captions = [];
          for (let index = 0; index < this.imageList.length; index++) {
            for (let j = 0; j < this.imageList[index].captions.length; j++) {
              if (this.imageList[index].captions[j].open && !this.imageList[index].captions[j].error) {
                data.captions.push({
                  caption: this.imageList[index].captions[j].recommendSentence,
                  image_id: this.imageList[index]._id,
                  refVieCaptionId: this.imageList[index].captions[j]._id
                })
              }
            }
          }
          this.saveRecCaption(data).then(res => {
            this.$router.push('/result')
          }).catch(err => {
            this.$notification({
              key: `Error`,
              message: 'Error',
              description: err
            })
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

.label {
  margin-top: 10px;
  label{ 
    font-weight: 600;
    .required {
      color: red;
    }
  }
  .ant-input {
    margin-top: 5px;
  }
}

.recommend {
  margin-top: 10px;
}

.submit {
    margin-top: 25px;
}

.error {
  color: #ff3333;
}
</style>
