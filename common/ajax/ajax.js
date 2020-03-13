import { ApiUrl } from './env.js'
import md5 from "@/common/utils/md5.js"
const getSecret=() =>{
	var timestamp = (new Date()).getTime();	
	var secret = md5.hex_md5("XM#" + md5.hex_md5(String(timestamp)) + "@secret");
	console.log(secret);
	return {
		'timestamp': timestamp,
		'secret': secret
	}
}
export {getSecret}
const ajax = (opt) => {
    opt = opt || {};
    opt.url = opt.url || '';
    opt.data = opt.data || null;
    opt.method = opt.method || 'GET';
    opt.header = opt.header || {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    opt.success = opt.success || function () {};

    uni.request({
        url: ApiUrl + opt.url,
        data: opt.data,
        method: opt.method,
        header: opt.header,
        dataType: 'json',
        success: function (res) {
            opt.success(res);
        },
        fail: function () {
            uni.showToast({
                title: '请稍后重试'
            });
        }
    })
}

export {
    ajax
}