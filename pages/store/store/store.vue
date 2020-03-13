<template>
	<view class="maps-container">
		<view class="search-bar">
			<view class="search-bar-form">
				<view class="search-bar-box">
					<!-- #ifdef APP-PLUS || MP -->
					<icon class="icon-search-in-box" type="search" size="16"></icon>
					<!-- #endif -->
					<input confirm-type="search" class="search-bar-input" placeholder="选择门店" :value="inputVal" :focus="inputShowed"
					 @confirm="bindInput" @input="inputTyping" />
					<view class="icon-clear" v-if="inputVal" @tap="clearInput">
						<!-- #ifdef APP-PLUS || MP -->
						<icon type="clear" size="14"></icon>
						<!-- #endif -->
					</view>
				</view>
				<label class="search-bar-label" v-show="!inputShowed" @tap="showInput">
					<!-- #ifdef APP-PLUS || MP -->
					<icon class="icon-search" type="search" size="16"></icon>
					<!-- #endif -->
					<view class="search-bar-text">请搜索门店</view>
				</label>
			</view>
			<view class="cancel-btn" @tap="hideInput" v-show="inputShowed">取消</view>

		</view>
		<view class="local">
			<tui-icon name="position-fill" color="#b2b2b2" size="20"></tui-icon>
			<text style="font-size: 26rpx;color: #b2b2b2;">当前位置</text>
			<h3 v-if="local">{{local}}</h3>
			<button v-else class='regetLocation' open-type='openSetting' bindopensetting='regetLocation'>定位失败！点击重新定位</button>
		</view>
		<view class="stores">
			附近的门店：
		</view>
		<scroll-view scroll-y class="scrollView" :style="{height:scrollH +'px'}">
			<view class="tui-list">
				<view class="tui-list-cell" v-for="(item,index) in address" :key="index">
					<view class="addr-box ">
						<view class="addr-detail " @tap="choose(item)">
							<view class=" addr-title ">{{item.store_name}}</view>
							<view class="distance">
								<text v-if="item.distance">{{item.distance}}</text>
								{{item.desc}}
							</view>

						</view>
						<!-- <view class="addr-opera ">							
							<view class="opera-box " hover-class="opcity" :hover-stay-time="150" @tap="go" :data-id="item.id">
								<image src="../../../static/img/go.png" class="mini-img"></image>
								<view class="text">到这里</view>
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import QQMapWX from '@/common/utils/qqmap-wx-jssdk.min.js'
	import tuiIcon from "@/components/icon/icon"
	export default {
		components: {
			tuiIcon
		},
		data() {
			return {
				inputShowed: false,
				inputVal: "",
				amapPlugin: null,
				city: '',
				address: [],
				scrollH: 256,
				local: ''
			}
		},
		onLoad() {

		},
		onShow() {
			if (uni.getStorageSync('storeList')) {
				this.address = uni.getStorageSync('storeList');
				this.local = uni.getStorageSync('local')
			} else {
				this.getLocation()
			}
		},
		methods: {
			// 重新定位
			regetLocation() {
				console.log(1);
				uni.getSetting({
					success: (res) => {
						console.log(res);
						if (res.authSetting['scope.userLocation'] === true) {

						}
					}
				})
			},
			showInput() {
				this.inputShowed = true
			},
			hideInput() {
				this.inputVal = "";
				this.inputShowed = false;
				uni.hideKeyboard(); //强行隐藏键盘
			},
			clearInput() {
				this.inputVal = ""
			},
			inputTyping(e) {
				this.inputVal = e.detail.value
			},
			// 获取当前位置
			getLocation() {
				uni.getLocation({
					success: (res) => {
						this.getCity(res.latitude, res.longitude) //获取当前所在城市						
					},
					fail: (res) => {
						console.log(res);

					}
				})
			},
			// 获取定位城市
			getCity(latitude, longitude) {
				// 实例化API核心类
				var demo = new QQMapWX({
					key: 'LVHBZ-SOY6W-Z5URP-OC34Q-CLWZH-Y6BCX' // 开发密钥（key）
				});
				demo.reverseGeocoder({
					location: {
						latitude: latitude,
						longitude: longitude
					},
					success: (res) => {
						console.log(res);
						this.city = res.result.ad_info.city;
						let latitude = res.result.location.lat;
						let longitude = res.result.location.lng;
						this.local = res.result.address;
						let params = {
							city: this.city,
							from: latitude + ',' + longitude
						}
						this.$xm.post('/Index/getStoreList', params, (res) => {
							this.address = res.data;
						})
					},
					fail: function(res) {
						console.log(res)

					},
					complete: function(res) {

					}
				});
			},


			choose(e) {
				uni.setStorageSync('store', e);
				uni.navigateBack();
			},
			go(event) {
				const index = Number(event.currentTarget.dataset.id)
				const item = this.address[index];
				const latitude = Number(item.latitude)
				const longitude = Number(item.longitude)
				uni.openLocation({
					name: item.title,
					address: item.address,
					latitude,
					longitude,
					scale: 18
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.regetLocation {
		background-color: transparent;
		margin: 0;
		padding: 0;
		border: 1px solid #fff;
		outline: none;
		color: #2c2c2c;
		font-size: 28rpx;
		line-height: 40rpx;
		height: 40rpx;
	}

	.regetLocation::after {
		border: none;
		margin: 0;
		padding: 0;
	}


	.regetLocation:active {
		color: #999;
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30upx;
	}

	.tui-cell-last::after {
		border-bottom: 0;
	}

	.maps-container {
		height: 100%;
		overflow: hidden;
	}

	map {
		width: 100%;
		height: 600upx;
	}

	.opcity {
		opacity: 0.5;
	}

	.scrollView {
		width: 100%;
		padding-bottom: 100upx;
		background: #fff;
	}

	.search-bar {
		position: relative;
		padding: 8px 10px;
		display: -webkit-flex;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		background-color: #fff;
	}

	.icon-search {
		margin-right: 8px;
		font-size: inherit;
		height: 18px;
		position: relative;
		top: 3px;
	}

	.icon-search-in-box {
		position: absolute;
		left: 10px;
		top: 6px;
	}

	.search-bar-form {
		position: relative;
		-webkit-box-flex: 1;
		-webkit-flex: auto;
		flex: auto;
		border-radius: 5px;
		background: #f0f0f0;
	}

	.search-bar-text {
		display: inline-block;
		font-size: 14px;
		vertical-align: middle;
	}

	.search-bar-box {
		position: relative;
		padding-left: 30px;
		padding-right: 30px;
		width: 100%;
		box-sizing: border-box;
		z-index: 1;
	}

	.search-bar-input {
		height: 30px;
		line-height: 30px;
		font-size: 14px;
	}

	.icon-clear {
		position: absolute;
		top: 0;
		right: 0;
		padding: 7px 8px;
		font-size: 0;
	}

	.search-bar-label {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		border-radius: 3px;
		text-align: center;
		color: #9b9b9b;
		background: #f0f0f0;
		line-height: 30px;
	}

	.cancel-btn {
		margin-left: 10px;
		line-height: 30px;
		color: #5982fd;
		white-space: nowrap;
		font-size: 15px;
	}

	.tui-list-cell {
		display: initial;
		padding: 30upx;
	}

	.addr-title {
		font-size: 30upx;
		line-height: 40upx;
		color: #000;
		font-weight: bold;
		width: 100%;
		padding-bottom: 20upx;
	}

	.addr-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.addr-detail {
		width: 450upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		font-size: 24upx;
		color: #999;
	}

	.distance {

		padding-right: 6upx;
	}

	.addr-opera {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.opera-box {
		text-align: center;
		margin-left: 26upx;
	}

	.mini-img {
		width: 44upx;
		height: 44upx;
	}

	.text {
		color: #333;
		font-size: 24upx;
		line-height: 30upx;
	}

	.local {
		text-align: left;
		padding: 30rpx;
		font-size: 30rpx;

		h3 {
			font-weight: bold;
		}
	}

	.stores {
		width: 100%;
		padding: 10rpx 30rpx;
		background-color: #EEEEEE;
		font-size: 28rpx;
	}
</style>
