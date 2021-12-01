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
    }
}