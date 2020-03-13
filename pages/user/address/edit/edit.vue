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
			<view class="row">
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
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
	</view>
</template>

<script>
	// 引入SDK核心类
	var QQMapWX = require('@/common/utils/qqmap-wx-jssdk.min.js');
	// 实例化API核心类
	var demo = new QQMapWX({
		key: 'LVHBZ-SOY6W-Z5URP-OC34Q-CLWZH-Y6BCX' // 开发密钥（key）
	});
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				unionid:'',
				secret:{},
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
				country: ''
			};
		},
		onLoad(option) {
			
			if (option) {
				this.editType = option.type;
				if (option.type == "add") {
					uni.setNavigationBarTitle({
						title:'新增收件人地址'
					});
					uni.getLocation({
						type: 'wgs84',
						success: (res) => {
							this.getCity(res.latitude, res.longitude);
						},
						fail: (res) => {
							this.region = ['请', '选', '择']
						},
					});
				}
				if (option.type == "edit") {
					uni.setNavigationBarTitle({
						title: '编辑收件人地址'
					});
					this.id = option.id;
					this.loadData(option.id)
				}
			}
			uni.getStorage({
				key:'user',
				success:(res)=>{
					this.secret=res.data;
					
				}
			})
			// uni.getStorage({
			// 	key:'address',
			// 	success:(res)=>{
			// 		console.log(res);
			// 		this.unionid=res.data.unionid;
			// 	}
			// })
		},		
		methods: {
			//获取当前地理位置
			//#ifdef MP 
			getCity(latitude, longitude) {				
				demo.reverseGeocoder({
					location: {
						latitude: latitude,
						longitude: longitude
					},
					success: (res) => {
						this.region = [res.result.address_component.province, res.result.address_component.city, res.result.address_component
							.district
						]
						this.country = '中国';
						this.address = res.result.address_component.street_number;
						this.location = {
							lat: res.result.location.lat,
							lng: res.result.location.lng
						};
					}
				});
			},
			// 获取订单详情
			loadData(id) {
				let params = {
					id: id,
				}
				this.$xm.post("/User/getInfo", params, res => {
					this.address = res.address;
					this.isDefault = res.default == 1 ? true : false;
					this.tel = res.phone;
					this.region = [res.province, res.city, res.town];
					this.location = {
						lat: res.latitude,
						lng: res.longitude
					};
					this.country = res.country;
					this.name = res.name;
					this.id=res.id;
				})

			},
			// 切换地址
			bindRegionChange(e) {
				this.region = e.detail.value;
				this.country = '中国';
				this.location = ""
			},
			//#endif
			// 删除
			del() {
				let param={
					xopenid: this.secret.openid,
					act: 'del',
					id: this.id,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				}
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res) => {
						if (res.confirm) {							
							this.$xm.post('/User/ajax', param, res => {
								if (res.s == 1) {
									uni.showToast({
										title: "删除成功",
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
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			// 验证表单
			save() {
				
				let data = {
					'xopenid':this.secret.openid,
					'secret':this.secret.secret,
					'timestamp':this.secret.timestamp,
					'unionid':this.secret.unionid,
					"name": this.name,
					"phone": this.tel,
					"country": this.country,
					"default": this.isDefault ? 1 : 0,
					"province": this.region ? this.region[0] : '',
					"city": this.region ? this.region[1] : '',
					"town": this.region ? this.region[2] : '',
					"address": this.address,
					"latitude": this.location ? this.location.lat : '',
					"longitude": this.location ? this.location.lng : ''
				};
				
				if (this.editType == 'edit') {
					data.id = this.id
				}
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
			isDefaultChange(){
				this.isDefault=!this.isDefault;
			},
			// 提交
			getEdit(data) {
				// 新增
				if (this.editType == "add") {
					this.$xm.post('/User/shipAdd', data, res => {
						if (res.s == 1) {
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
				} else {
					// 编辑
					data.id = this.id;
					this.$xm.post('/User/saveAdr', data, res => {
						if (res.s == 1) {
							uni.showToast({
								title: "修改成功",
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
