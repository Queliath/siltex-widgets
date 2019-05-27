import Vue from 'vue';
import VueJsonp from 'vue-jsonp';

Vue.use(VueJsonp);

export default {
    loadComments: function (pageNumber) {
        return Vue.jsonp('https://api.vk.com/method/board.getComments', {
            group_id: 59824081,
            topic_id: 31405611,
            offset: (pageNumber - 1) * 20,
            need_likes: 1,
            extended: 1,
            access_token: '5e13673bdf53c34c2e380bf838b36563322dfd6da5fd46b8d6042a3a7c9a4892d52461fd53324ef29cff2',
            v: '5.95'
        });
    }
}