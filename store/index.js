import Labels from './labels'
import VieCaption from './viecaption'
import Vue from 'vue';
import Vuex from 'vuex'
import {setLoadingSpin} from './mutations-type'

Vue.use(Vuex);

export const state = () => ({
    loadingSpin: false
})

export const mutations = {
    [setLoadingSpin](state, value) {
        state.loadingSpin = value;
    }
}

export const modules = {
    Labels,
    VieCaption
}
