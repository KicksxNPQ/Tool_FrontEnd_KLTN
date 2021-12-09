import {API_ENDPOINT} from "~/config"

export default {
    loadLabels({}, ) {
        console.log(API_ENDPOINT);
        const url = `${API_ENDPOINT}/api/labels`
        return new Promise((resolve,reject) => {
            this.$axios.get(url).then(res => {
                resolve(res.data);
            })   
        })
    },

    saveRecCaption({}, obj) {
        const url = `${API_ENDPOINT}/api/reccaption`;
        return new Promise((resolve,reject) => {
            this.$axios.post(url, obj).then(res => {
                if (!res.errors) resolve(true);
                reject(res.errors);
            })
        })
    }
}