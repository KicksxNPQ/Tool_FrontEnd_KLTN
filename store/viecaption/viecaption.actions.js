import {API_ENDPOINT} from '~/config'
import {cloneDeep} from 'lodash'
export default {
    createVieCaption({}, image_id) {
        const model = {
            image_id,
            caption: ''
        }
        let arrModel = [];
        for (let i = 0; i < 5; i++) 
            arrModel.push(cloneDeep(model));
        return arrModel;
    },
    saveVieCaption({}, req) {
        const url = `${API_ENDPOINT}/api/viecaption`;
        return new Promise((resolve,reject) => {
            this.$axios.post(url, req).then(res => {
                if (!res.data.error) {
                    resolve('Label successfully');
                }
                else 
                    reject(res.data.error);
            })
        })
    },
    getVieCaption({}) {
        const url = `${API_ENDPOINT}/api/viecaption`;
        return new Promise((resolve, reject) => {
            this.$axios.get(url).then(res => {
                if (!res.data.error) {
                    resolve(res.data);
                }
                else {
                    reject(res.data.error);
                }
            })
        })
    }
}