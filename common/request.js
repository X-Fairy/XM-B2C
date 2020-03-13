import { ApiUrl } from './ajax/env.js'
// POST请求
function post(url, params, success, fail) {
	let that = this;
	const user = uni.getStorageSync('user');
	const cooking = JSON.parse(JSON.stringify(user).replace(/openid/g,"xopenid"));	
	if(uni.getStorageSync('store').store_code){
		cooking.store=uni.getStorageSync('store').store_code
	}else{
		cooking.store='10001'
	}
	
	let label = Object.assign(cooking, params);	
	uni.request({
		url: ApiUrl + url,
		method: 'POST',
		header: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		data: label,
		success: res => {
			
			success(res.data) //回调
		},
		fail: (res) => {
			console.log(res);
			uni.hideLoading();
			uni.showModal({
				content: "网络异常,请重新加载",
				success: (e) => {
					if (e.confirm) {
						load("重新加载")
						loadsatus = 2
						setTimeout(function() {
							post(url, params, success, fail)
						}, 1000)
					}
				}
			})
			if (res.errMsg == "request:fail timeout") {
				return false;
			};
			fail(res) //回调
		},
		complete: function() {}
	});
}
// 优化商品数据
function requestImg(list) {
	console.log(list)
	list.forEach((item, index) => {
		if (item.pro_price) {
			item.pro_price = Number(item.pro_price)
		}
		if (item.pronum) {
			item.pronum = Number(item.pronum)
		}
		item.pro_img =
			"http://img.xmvogue.com/thumb/" +
			item.pro_sn +
			".jpg?x-oss-process=style/300";
	})
}
/**
 * 把时间转化成2017-05-28 00:00:00 类似这样的时间格式
 */
function changeTime(time){
    let date = new Date(time);
    let z = date.getFullYear() + '年',
    b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月',
    n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + " 日" ,
    h = (date.getHours() < 10 ? '0'+ (date.getHours()) : date.getHours()) + ":",
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":",
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return z+b+n+h+m+s;
}
export default {
	post: post,
	requestImg: requestImg,
	changeTime:changeTime
}
