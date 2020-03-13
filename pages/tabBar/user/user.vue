<template>
	<view>
		<view class="part-one">
			<view class="top">
				<view class="left" v-if="userInfo">
					<image :src="userInfo.avatarUrl" mode="" class="avatar"></image>
					<text class="name">{{userInfo.nickName}}</text>
					<!-- <button type="submit" open-type="getUserInfo" bindgetUserInfo="getUserInfo" style="font-size: 28rpx;">请登录</button> -->
					<!-- <text class="type">大众会员</text> -->
				</view>
				<view class="left" v-else>
					<!-- <button type="submit" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true" style="font-size: 28rpx;">授权登录</button> -->
					<text class="name">未登录</text>
				</view>
				<view class="right">
					<!-- <tui-icon name="signin" color="#e84341" size="24"></tui-icon>
					<text>签到领积分</text> -->
				</view>
			</view>
			<view class="vip">
				<image src="../../../static/img/user/vip01.jpg" mode=""></image>
				<view class="vip-info">

				</view>
			</view>
			<view class="upvip">

			</view>
		</view>
		<view class="part-two">
			<view class="item">
				<h4>0</h4>
				<text>会员积分</text>
			</view>
			<view class="item" @tap="toPage('../../user/coupon/coupon')">
				<h4>0</h4>
				<text>优惠券</text>
			</view>
			<view class="item" @tap="toCart()">
				<h4>{{count || 0}}</h4>
				<text>购物车</text>
			</view>
			<view class="item" style="border: none;">
				<h4>0</h4>
				<text>附近门店</text>
			</view>
		</view>
		<view class="order">
			<!-- 订单类型 -->
			<view class="hearder">
				<view class="title">我的订单</view>
				<view class="all">
					<view @tap="toOrderList()">
						全部订单
					</view>
					<view class="icon xiangyou"></view>
				</view>
			</view>

			<view class="list">
				<view class="box" v-for="(row,index) in orderList" :key="index" @tap="toOrderList(row.id)">
					<view class="img">
						<view class="icon" :class="row.icon"></view>
						<text class="num" v-if="row.num>0">{{row.num}}</text>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 工具栏 -->
		<view class="toolbar">
			<button open-type="contact" class="conbtn">
				<view class="list">
					<view class="text">
						联系客服
					</view>
					<view class="icon xiangyou"></view>
				</view>
			</button>
			<view class="list" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
				<view class="text">{{row.text}}</view>
				<view class="icon xiangyou"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place-bottom"></view>
		<tui-modal :show="showModal" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="tui-prompt-title">为更好的提供服务给您</view>
				<view class="tui-prompt-title">我们需要您最基本的授权（头像，昵称）</view>
				<button type="warn" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true" style="margin: 20rpx 0;">授权登录</button>

			</view>

		</tui-modal>
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiIcon,
			tuiModal
		},
		data() {
			return {
				secret: {},
				userInfo: '',
				showModal: true,
				// 订单类型
				orderList: [{
						text: '未付款',
						icon: "fukuan",
						id: "0",
						num: 0
					},
					{
						text: '已付款',
						icon: "fahuo",
						id: "1",
						num: 0
					},
					{
						text: '已发货',
						icon: "shouhuo",
						id: "3",
						num: 0
					},
					{
						text: '已收货',
						icon: "pingjia",
						id: "4",
						num: 0
					},
					{
						text: '退款',
						icon: "tuihuo",
						id: "8",
						num: 0
					}
				],
				// 工具栏列表
				mytoolbarList: [{
						url: '../../user/address/address',
						text: '收货地址',
					},
					
					{
						url: '../../user/keep/keep',
						text: '我的收藏'
					},
					{
						url: '',
						text: '团购专享'
					},
					{
						url: '',
						text: '关于我们'
					},
				],
				// 购物车数量
				count: 0
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: (res) => {
					this.secret = res.data;
				}
			})

		},
		onShow() {
			this.getcount();
			uni.getStorage({
				key: 'cart',
				success: (res) => {
					this.count = res.data;
				}
			})

			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.userInfo = res.data;
					if (!this.userInfo) {
						this.showModal = true
					} else {
						this.showModal = false;
					}
				}
			})

		},
		methods: {
			getuserinfo() {
				// wx登录
				uni.login({
					success: (res) => {
						if (res.code) {
							var code = res.code
							uni.getUserInfo({
								success: (res) => {
									this.userInfo = res.userInfo;
									this.showModal = false;
									let data = {
										encryptedData: res.encryptedData,
										iv: res.iv,
										sessionKey: this.secret.sessionKey,
										secret: this.secret.secret,
										timestamp: this.secret.timestamp,
									}
									this.$xm.post('/Index/getUnionid', data, (res) => {
										this.secret.unionid = res.unionid
										uni.setStorage({
											key: 'user',
											data: this.secret,
											success: (res) => {
												console.log(res);
											}
										});
									})
									uni.setStorage({
										key: 'userInfo',
										data: res.userInfo,
										success: (res) => {
											console.log(res);
										}
									});

								},
								fail: res => {
									// 获取失败的去引导用户授权 
								}
							})

						} else {}
					}
				})
			},
			toOrderList(index) {
				if (!index) {
					index = "s"
				}
				console.log(index)
				uni.setStorageSync('tbIndex', index);
				uni.navigateTo({
					url: '../../user/order_list/order_list?tbIndex=' + index
				})
			},
			// 获取订单shuliang
			getcount() {				
				this.$xm.post('/Mine/index', '', (res) => {
					console.log(res);
					let result = res.order_state;
					for(let i in result){
						
						if(result[i].order_state==this.orderList[i].id){
							this.orderList[i].num=result[i].state
						}
					}


				})
			},
			toCart() {
				uni.switchTab({
					url: '../cart/cart'
				})
			},
			toPage(url) {
				console.log(url);
				if (!url) {
					uni.showToast({
						title: '此内容正在开发中',
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: url
				})
			},
			close() {
				this.showModal = false;
			}
		}
	}
</script>

<style lang="scss">
	.conbtn {
		line-height: inherit !important;
		width: 100% !important;
		background-color: #FFFFFF !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	button::after {
		border: none !important;
	}

	.tui-modal-custom {
		text-align: center;
		font-size: 30rpx !important;

	}

	.part-one {
		width: 92%;
		margin: auto;

		.top {
			padding: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					background-color: #e84341;
					border-radius: 40rpx;
				}

				.name {
					padding: 0 16rpx;
					font-size: 28rpx;

				}

				// button {
				// 	background-color: #FFFFFF !important;
				// }

				// button::after {
				// 	border: none !important;
				// }

				.type {
					width: 120rpx;
					height: 32rpx;
					border-radius: 16rpx;
					border: solid 2rpx #999999;
					color: #999999;
					font-size: 24rpx;
					text-align: center;
				}
			}

			.right {
				display: flex;
				align-items: center;

				text {
					font-size: 24rpx;
					font-weight: bold;
					color: #969897;
					margin-left: 6rpx;
				}
			}
		}

		.vip {
			image {
				width: 690rpx;
				height: 400rpx;
			}
		}
	}

	.part-two {

		width: 92%;
		margin: auto;
		display: flex;
		align-items: center;
		margin-top: 40rpx;

		.item {
			padding: 10rpx;
			width: 25%;
			text-align: center;
			border-right: 3rpx solid #b2b2b2;

			h4 {
				font-size: 36rpx;
			}

			text {
				color: #8c8c8c;
				font-size: 24rpx;
			}
		}
	}

	.order {
		width: 92%;
		margin: auto;
		margin-top: 40rpx;
		padding: 0 4% 0upx 4%;
		height: 265rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 1rpx 20rpx 0rpx rgba(173, 173, 173, 0.4);

		.hearder {
			margin-top: 20upx;
			margin-bottom: 25upx;
			height: 80upx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				font-size: 28rpx;
			}

			.all {
				font-size: 28upx;
				color: #969696;
				display: flex;
				align-items: center;

				.xiangyou {
					color: #adadad;
					font-size: 26upx;
					margin-left: 10upx;
				}
			}
		}

		.list {
			display: flex;
			// border-bottom: solid 1upx #17e6a1;
			padding-bottom: 10upx;

			.box {
				width: 20%;

				.img {
					width: 100%;
					display: flex;
					justify-content: center;
					position: relative;

					.icon {
						font-size: 50upx;
						color: #e84341;
					}

					.num {
						padding: 5rpx;
						position: absolute;
						right: 18rpx;
						top: -17rpx;
						display: inline-block;
						width: 30rpx;
						height: 30rpx;
						background-color: red;
						color: #fff;
						font-size: 25rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #727272;
					padding-top: 10rpx;




				}
			}
		}


	}

	.toolbar {
		margin-top: 40rpx;
		width: 100%;

		.list {
			padding: 30rpx;
			border-bottom: 1rpx solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				font-size: 27rpx;
			}

			.xiangyou {
				color: #adadad;
				font-size: 26upx;
				margin-left: 10upx;
			}
		}
	}
</style>
