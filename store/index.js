import Vue from 'vue'
import Vuex from 'vuex'
import md5 from '../common/utils/md5.js'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		globalData: '' //存储词条的变量
	},
	getters: {
		userData(state) {
			return state.globalData;
		},
	},
	mutations: {
		//修改数据仓库的事件		
		setglobalData(state, params) {
			console.log(params,state);
			state.globalData = params;
		},
	},
	actions: {
		
		//推荐使用的异步修改数据仓库
		getLogin() {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					var timestamp = (new Date()).getTime();
					var secret = md5.hex_md5("XM#" + md5.hex_md5(String(timestamp)) + "@secret");

					if (res.code) {
						uni.request({
							url: 'https://dh.xmvogue.com/API/Index/index/',
							data: {
								code: res.code,
								secret: secret,
								timestamp: timestamp
							},
							method: 'POST',
							header: {
								"Content-Type": "application/x-www-form-urlencoded" //自定义请求头信息
							},
							success: (res) => {
								console.log(res.data);
								commit('setglobalData', res.data)
							}
						});
					}
				}
			});
		}
	}
})
