import Vue from 'vue'
import App from './App'
import VueLazyload from 'vue-lazyload' //图片的懒加载
Vue.config.productionTip = false
import index from './common/request'
import store from 'store/index.js'
App.mpType = 'app'
Vue.prototype.$xm = index;
Vue.use(VueLazyload, {
 loading: require('./static/img/error.jpg')
})
Vue.prototype.cateSelect = function(key) {
	var cateID = uni.getStorageSync("cateSelect");
	if (cateID != null && cateID != "" && cateID != undefined) {
		return cateID;
	} else {
		return null;
	}
}

const app = new Vue({
	...App,
	store
})
app.$mount()
