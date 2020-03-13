<script>
	import md5 from "@/common/utils/md5.js"
	export default {
		globalData: {

		},
		onLaunch: function() {
			console.log('App Launch')
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
								res.data.secret = secret;
								res.data.timestamp = timestamp;
								uni.setStorage({
									key: 'user',
									data: res.data,
									success: (res) => {
										console.log(res);
									}
								});
							}
						});
					}


				}
			});
			// #ifdef MP-WEIXIN
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {});
			updateManager.onUpdateReady(function(res) {
				let that = this
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					cancelText: that.$t('index').cancel,
					confirmText: that.$t('index').confirm,
					success(res) {
						if (res.confirm) {
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			// #endif

		},
		onShow: function() {
			console.log('App Show')

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";

	.title-two {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.title-one {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
</style>
