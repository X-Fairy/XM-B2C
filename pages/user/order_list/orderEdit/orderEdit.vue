<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="tel" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input">
					<!-- #ifdef MP -->
					<picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
						<view class="picker">
							{{region[0]}}{{region[1]}}{{region[2]}}
						</view>
					</picker>
					<!-- #endif -->
				</view>

			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="address" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<!-- <view class="row">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#f06c7a" :checked="isDefault" @change="isDefaultChange" />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view> -->
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				修改地址
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				unionid: '',
				secret: {},
				editType: 'edit',
				id: '',
				name: '',
				tel: '',
				isDefault: false,
				themeColor: '#007AFF',
				region: ['', '', ''],
				location: {
					lat: '',
					lng: ''
				},
				address: '',
				country: '',
				sn: ''
			};
		},
		onLoad(option) {

			if (option) {
				uni.getStorage({
					key: 'user',
					success: (res) => {
						this.secret = res.data;
						this.sn = option.sn
						this.loadData(option.sn)
					}
				})
			}


		},
		methods: {
			//获取当前地理位置
			//#ifdef MP 
			// 获取订单详情
			loadData(sn) {
				let params = {
					order_sn: sn,
					xopenid: this.secret.openid,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				}
				this.$xm.post("/Order/getOrderInfo", params, eve => {
					var res = eve.contact;
					this.address = res.address;
					this.tel = res.phone;
					this.region = [res.province, res.city, res.town];
					this.country = res.country;
					this.name = res.name;
					this.id = res.id
				})

			},
			// 切换地址
			bindRegionChange(e) {
				this.region = e.detail.value;
				this.country = '中国';
				this.location = ""
			},
			//#endif
			// 验证表单
			save() {
				console.log(this.isDefault);
				let data = {
					xopenid: this.secret.openid,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp,
					address: this.address,
					country: "中国",
					id: this.id,
					name: this.name,
					order_sn: this.sn,
					phone: this.tel,
					province: this.region[0],
					city: this.region[1],
					town: this.region[2],
					zip: ""
				};


				if (!data.name) {
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					});
					return;
				}
				if (!data.phone) {
					uni.showToast({
						title: '请输入收件人电话号码',
						icon: 'none'
					});
					return;
				}
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!myreg.test(data.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码！',
						icon: 'none'
					});
					return;
				}
				if (this.region.length == 0) {
					uni.showToast({
						title: '请选择收件地址',
						icon: 'none'
					});
					return;
				}
				if (!data.address) {
					uni.showToast({
						title: '请输入收件人详细地址',
						icon: 'none'
					});
					return;
				}
				this.getEdit(data)


			},
			isDefaultChange() {
				this.isDefault = !this.isDefault;
			},
			// 提交
			getEdit(data) {
				this.$xm.post('/Order/orderaddr', data, res => {
					if (res.code == 2000) {
						uni.showToast({
							title: "提交成功",
							icon: 'none'
						});
						uni.hideLoading();
						uni.navigateBack();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}

				})
			}
		},

	};
</script>
<style lang="scss">
	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		view {
			display: flex;
		}

		.row {
			width: 94%;

			margin: 0 3%;
			border-top: solid 1upx #eee;

			.nominal {
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}

			.input {
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20upx 0;
					min-height: 120upx;
				}
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255, 0, 0, 0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
</style>
