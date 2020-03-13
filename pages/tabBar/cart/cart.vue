<template>
	<view class="container">
		<!-- #ifdef MP || H5-->
		<view class="status" :style="{position:headerPosition}"></view>
		<view class="header" :style="{position:headerPosition}">
			<view class="tag" v-if="showTag">
				<view :class="tagIndex==1?'active':''" class="headquarters" @tap="chooseStore(1)">总部旗舰店</view>
				<view :class="tagIndex==2?'active':''" class="store" @tap="chooseStore(2)">门店商品</view>
			</view>
			<view class="storeNmae" v-if="showTag">
				<tui-icon name="shop-fill" color="#b2b2b2" size="20" style="padding-right: 10rpx;"></tui-icon>{{storeName}}
			</view>
			<view class="tui-activity">
				<view class="tui-bold">{{tips}}</view>
				<!-- <view class="tui-buy" @tap="topage()">去凑单<tui-icon name="arrowright" :size="18" color="#333"></tui-icon>
				</view> -->
			</view>
			<view class="tui-edit-goods">
				<view>购物车共<text class="tui-goods-num">{{count || 0}}</text>件商品</view>
				<view class="msg" style="color: #e41f19;">
					{{msg}}
				</view>
				<!-- <view>
					<tui-button type="danger" :shadow="true" :plain="true" shape="circle" width="160rpx" height="60rpx" :size="24" @click="delGoods">删除</tui-button>
				</view> -->
			</view>

		</view>
		<!-- 占位 -->
		<view :class="showTag?'place':'placeTwo'"></view>
		<!-- #endif -->
		<view class="tis" v-if="dataList.length==0">购物车是空的哦~</view>
		<checkbox-group @change="itemchange" style="margin-bottom: 50rpx;">
			<view class="tui-cart-cell  tui-mtop" v-for="(item,index) in dataList" :key="index">
				<tui-swipe-action :actions="actions" @click="handlerButton" :params="item">
					<template v-slot:content>

						<view class="tui-goods-item">
							<label class="tui-checkbox">
								<!-- <checkbox color="#fff" :checked="itemchecked" :value="item.proid"></checkbox> -->
							</label>
							<!-- <imglazy :url="item.pro_img" class="tui-goods-img"></imglazy> -->
							<image :src="item.pro_img" class="tui-goods-img" @tap="toGood(item)" />
							<view class="tui-goods-info">
								<view class="tui-goods-title" @tap="toGood(item)">
									{{item.pro_name}}
								</view>
								<view class="tui-goods-model">
									<!-- <view class="tui-model-text">货号：{{item.pro_sn}}</view> -->
									<!-- <tui-icon name="arrowdown" :size="16" color="#333"></tui-icon> -->
								</view>
								<view class="tui-price-box">
									<view class="tui-goods-price" v-if="item.dis_price" @tap="toGood(item)">¥{{ item.dis_price }}
										<text class="dis_price" v-if="item.dis_price">{{ item.pro_price }}</text>
									</view>
									<view class="tui-goods-price" v-else>¥{{ item.pro_price }}

									</view>
									<view class="tui-scale">
										<tui-numberbox :value="item.pronum" :height="40" :width="74" :min="1" :index="item.proid" @change="changeNum"></tui-numberbox>
									</view>
								</view>
							</view>
						</view>
					</template>
				</tui-swipe-action>
				<!-- <view class="tui-sub-info" v-if="index%2==0">赠品：柔色尽情丝柔口红唇膏1支柔色尽情丝柔口红唇膏1支</view> -->
			</view>
		</checkbox-group>
		<!--猜你喜欢-->

		<tui-divider :size="28" :bold="true" color="#333" width="50%">
			<tui-icon name="like" :size="18" color="#e41f19"></tui-icon>
			<text class="tui-youlike">猜你喜欢</text>
		</tui-divider>
		<view class="tui-product-list" :scroll-top="scrollTop">
			<view class="tui-product-container">
				<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2!=0">
					<!--商品列表-->
					<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" >
						<image :src="item.pro_sn" class="tui-pro-img" mode="widthFix"  @tap="detail(item)"/>
						<view class="tui-pro-content">
							<view class="tui-pro-tit title-one" @tap="detail(item)">{{item.pro_name}}</view>
							<view class="bottom-info">
								<view class="tui-pro-price" @tap="detail(item)">
									<text class="tui-sale-price">￥{{item.pro_price}}</text>
								</view>
								<image src="../../../static/img/tabBar/cart-on.png" mode="" @tap="joinCart(item)" class="cart"></image>
							</view>
						</view>
					</view>

				</block>
			</view>
			<view class="tui-product-container">
				<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2==0">
					<!--商品列表-->
					<view class="tui-pro-item" hover-class="hover" :hover-start-time="150">
						<image :src="item.pro_sn" class="tui-pro-img" mode="widthFix" @tap="detail(item)" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit title-one" @tap="detail(item)">{{item.pro_name}}</view>
							<view class="bottom-info">
								<view class="tui-pro-price" @tap="detail(item)">
									<text class="tui-sale-price">￥{{item.pro_price}}</text>
								</view>
								<image src="../../../static/img/tabBar/cart-on.png" mode="" class="cart" @tap="joinCart(item)"></image>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<!--tabbar-->
		<view class="tui-tabbar">
			<view class="tui-checkAll">
				<!-- <checkbox-group @change="checkboxChange">
					<label class="tui-checkbox">
						<checkbox color="#fff" :checked="allchecked" ></checkbox>
						<text class="tui-checkbox-pl">全选</text>
					</label>
				</checkbox-group> -->
				<view class="tui-total-price">合计:<text class="tui-bold">￥{{allprice || 0}}</text><text style="font-size: 24upx;color: #000000; text-decoration: line-through;padding-left: 10rpx
				;">{{totalMoney || 0}}</text>
				</view>
			</view>
			<view>
				<tui-button v-if="userInfo" width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" @click="btnPay">去结算</tui-button>
				<button v-else type="warn" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true" style="height: 70rpx;line-height: 70rpx;font-size: 30rpx;border-radius: 50rpx;
">去结算</button>
			</view>
		</view>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
	</view>
</template>

<script>
	import tuiSwipeAction from "@/components/swipe-action/swipe-action"
	import tuiButton from "@/components/extend/button/button"
	import tuiNumberbox from "@/components/numberbox/numberbox"
	import tuiIcon from "@/components/icon/icon"
	import tuiDivider from "@/components/divider/divider"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import {
		ajax,
		getSecret
	} from '@/common/ajax/ajax.js'
	export default {
		components: {
			tuiSwipeAction,
			tuiButton,
			tuiNumberbox,
			tuiIcon,
			tuiDivider,
			tuiLoadmore
		},
		data() {
			return {
				store: '',
				storeName: '总部旗舰店',
				tagIndex: 1,
				showTag: false,
				userInfo: null,
				headerPosition: "fixed",
				secret: '',
				openid: '',
				dataList: [],
				actions: [{
					name: '删除',
					color: '#fff',
					fontsize: 28,
					width: 64,
					background: '#F82400'
				}],
				isEdit: false,
				productList: [],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				// 购物车总数量
				count: 0,
				// 总金额
				totalMoney: 0,
				// 全选
				allchecked: false,
				// 单项：
				itemchecked: false,
				// 选择的商品
				chooseList: [],
				// 删除商品ID
				delId: '',
				act: '',
				tips: '',
				msg: '',
				// 支付金额
				allprice: 0,
				scrollTop: 0

			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		onLoad() {
			this.secret = uni.getStorageSync('user');			
			this.getproList()
			
		},
		onShow() {
			this.tagIndex=1
			this.store = 10001;
			this.changeData();			
			let code = uni.getStorageSync('store').store_code;			
			if (code == 10001) {
				this.showTag = false;
			} else if (typeof(code) == 'undefined') {
				this.showTag = false;
			} else {
				this.showTag = true;
			}
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					console.log(res);
					this.userInfo = res.data;
				}
			});

		},
		methods: {
			toGood(e) {
				console.log(e);
				uni.navigateTo({
					url: '../../goods/goods?gid=' + e.proid
				})
			},
			chooseStore(e) {
				this.tagIndex = e;
				if (e == 1) {
					this.store = 10001;
					this.storeName = '总部旗舰店'
					this.changeData();
					this.productList=[];
					this.changeProlist()
				} else {
					this.store = uni.getStorageSync('store').store_code;
					this.storeName = uni.getStorageSync('store').store_name;
					this.changeData();
					this.productList=[];
					this.changeProlist()
				}

			},
			changeProlist() {
				ajax({
					url: '/Cart/guess',
					data: {
						xopenid: this.secret.openid,
						sessionKey: this.secret.sessionKey,
						secret: this.secret.secret,
						timestamp: this.secret.timestamp,
						store: this.store
					},
					method: 'post',
					success: (res) => {						
						let data = res.data.data;
						if (data.length == 0) {
							this.productList = [];
						} else {
							data.map(ele => {
								ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
								
							});							
							if(data.length=20){
								this.productList = this.productList.concat(data);
							}else{
								this.productList=data;
							}						
						}

					},
					error: () => {}
				})
			},
			changeData() {
				ajax({
					url: '/Cart',
					data: {
						xopenid: this.secret.openid,
						sessionKey: this.secret.sessionKey,
						unionid: '',
						secret: this.secret.secret,
						timestamp: this.secret.timestamp,
						store: this.store
					},
					method: 'post',
					success: (res) => {
						let goodsList = res.data.prolist;
						this.$xm.requestImg(goodsList);
						this.dataList = goodsList;
						this.count = res.data.count
						this.totalMoney = res.data.allprice;
						this.tips = res.data.tips;
						this.getmatchOptimals();
						if (this.count !== null) {
							this.count = this.count.toString()
							uni.setTabBarBadge({
								index: 2,
								text: this.count
							})
						} else {
							uni.removeTabBarBadge({
								index: 2,
							})
						}
						uni.setStorage({
							key: 'cart',
							data: this.count,
							success: (res) => {
								console.log(res);
							}
						})
					},
					error: () => {}
				})
			},
			getuserinfo() {
				// wx登录
				uni.login({
					success: (res) => {
						if (res.code) {
							var code = res.code
							uni.getUserInfo({
								success: (res) => {
									this.userInfo = res.userInfo;
									let params = {
										encryptedData: res.encryptedData,
										iv: res.iv,
									}
									this.$xm.post('/Index/getUnionid', params, (res) => {
										uni.setStorage({
											key: 'unionid',
											data: res.unionid,
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
									uni.navigateTo({
										url: '../../order/confirmation?store='+this.store
									})
								},
								fail: res => {
									// 获取失败的去引导用户授权 
								}
							})

						} else {}
					}
				})
			},
			// 获取优惠活动
			getmatchOptimals() {
				let data = {
					money: this.totalMoney
				}
				this.$xm.post('/Coupon/match_optimals', data, res => {
					this.msg = res.data.msg;
					this.allprice = res.data.money;


				})

			},
			// 获取猜你喜欢
			getproList() {
				this.$xm.post('/Cart/guess', '', (res) => {
					res.data.map(ele => {
						ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
						
					});
					this.productList = this.productList.concat(res.data);


				})
			},
			// 获取购物车
			loadData() {
				this.$xm.post('/Cart', '', res => {
					let goodsList = res.prolist;
					this.$xm.requestImg(goodsList);
					this.dataList = goodsList;
					this.count = res.count
					this.totalMoney = res.allprice;
					this.tips = res.tips;
					this.getmatchOptimals();
					if (this.count !== null) {
						this.count = this.count.toString()
						uni.setTabBarBadge({
							index: 2,
							text: this.count
						})
					} else {
						uni.removeTabBarBadge({
							index: 2,
						})
					}
					uni.setStorage({
						key: 'cart',
						data: this.count,
						success: (res) => {
							console.log(res);
						}
					})

				})
			},
			itemchange(e) {
				console.log(e);
			},
			checkboxChange(e) {
				this.allchecked = !this.allchecked;
				if (this.allchecked) {
					this.itemchecked = true;
				} else {
					this.itemchecked = false;
				}
			},
			changeNum(e) {
				this.delId = e.index;
				if (e.value == 0) {
					uni.showModal({
						title: '确定删除商品吗？',
						content: '',
						confirmText: '取  消',
						cancelColor: '#b2b2b2',
						confirmText: '确  定',
						confirmColor: '#2c2c2c',
						success: (res) => {
							if (res.confirm) {
								this.act = 'del';
								this.del();
							}
						},
					})
				} else {
					if (e.type == 'plus') {
						this.act = 'add';
						this.del()
					} else if (e.type == 'reduce') {
						this.act = 'reduce';
						this.del();
					}
				}


			},
			handlerButton(e) {
				this.delId = e.item.proid;
				this.act = 'del';
				this.del();
			},
			// 删除购物车
			del() {
				let params = {
					act: this.act,
					id: this.delId,

				}
				this.$xm.post('/Cart/ajax', params, res => {
					if (res.msg == '操作成功') {
						// this.loadData()();
						this.changeData()
					}
				})
			},
			// 加入购物车
			joinCart(e) {
				let params = {
					proid: e.id,
					pronum: 1,
					store:this.store
				};
				this.$xm.post('/Cart/add', params, (res) => {
					let result = res.msg;
					if (result == '加入购物车成功') {
						uni.showToast({
							title: "已加入购物车"
						});
						// this.loadData()();
						this.changeData()
					}
				})

			},
			delGoods: function() {
				// #ifdef H5 || MP
				this.isEdit = !this.isEdit;
				// #endif
			},
			detail(e) {
				uni.navigateTo({
					url: '../../goods/goods?gid=' + e.id
				});
			},
			topage() {
				uni.switchTab({
					url: '../category/category'
				})
			},
			btnPay() {
				console.log(this.store);
				uni.navigateTo({
					url: '../../order/confirmation?store='+this.store
				})
				// uni.navigateTo({
				// 	url: '../../order/confirmation'
				// })
			}
		},

		onPullDownRefresh() {
			// this.loadData()
			this.changeData()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)
		},
		onReachBottom() {
			this.changeProlist();
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)

		},

	}
</script>

<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 1000;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {
		width: 100%;
		// height: 100upx;
		position: fixed;
		top: 0;
		z-index: 10000;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.tui-edit-goods {
			width: 100%;
			border-radius: 12rpx;
			overflow: hidden;
			padding: 24rpx 30rpx 20rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #333;
			font-size: 26rpx;

			.tui-goods-num {
				font-weight: bold;
				color: #e41f19;
			}
		}

		.tui-activity {
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 30rpx 10rpx 30rpx;
			box-sizing: border-box;
			background-color: #FFDBB7;
			// margin-top: 20rpx;

			.tui-buy {
				display: flex;
				align-items: center
			}

			.tui-bold {
				font-weight: bold;
			}
		}
	}

	.tag {
		width: 70%;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		line-height: 60rpx;
		padding-top: 5rpx;

		.store,
		.headquarters {
			width: 50%;
			text-align: center;
			height: 100%;
			font-size: 28rpx;
			border: 1px solid #e84341;
		}

		.headquarters {
			border-radius: 30rpx 0 0 30rpx;
			border-right: 0;
		}

		.store {
			border-radius: 0 30rpx 30rpx 0;
			border-left: 0;
		}

		.active {
			background-color: #e84341;
			color: #FFFFFF;
		}
	}

	.place {
		background-color: #ffffff;
		height: 300rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.placeTwo {
		background-color: #ffffff;
		height: 170rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.tis {
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		margin-bottom: 40rpx;
	}

	.container {
		padding-bottom: 120rpx;
	}

	.tui-mtop {
		// margin-top: 24rpx;
	}





	.tui-cart-cell {
		width: 100%;
		border-radius: 12rpx;
		background: #FFFFFF;
		overflow: hidden;
		box-shadow: 0rpx 1rpx 20rpx 0rpx rgba(173, 173, 173, 0.4);
		margin-bottom: 20rpx;
		padding-top: 30rpx;
	}

	.storeNmae {
		padding: 20rpx 30rpx;
		font-size: 30rpx;
	}

	.tui-goods-item {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
		padding-bottom: 30rpx;
	}

	.tui-checkbox {
		/* width: 40rpx; */
		padding-right: 30rpx;
		display: flex;
		align-items: center;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-checkbox .wx-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		margin: 0;
	}

	.tui-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}

	/* #endif */
	/* #ifdef H5 */
	>>>.tui-checkbox .uni-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50% !important;
		margin: 0;
	}

	>>>.tui-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}

	/* #endif */
	.tui-goods-img {
		width: 220rpx;
		height: 220rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}

	.tui-goods-info {
		width: 100%;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
		color: #333;
	}

	.tui-goods-model {
		max-width: 100%;
		color: #333;
		background: #F5F5F5;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	.tui-model-text {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 24rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-price-box {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;

		.dis_price {
			color: #b2b2b2;
			font-size: 30rpx;
			margin-left: 10rpx;
			text-decoration: line-through;
		}
	}

	.tui-scale {
		transform: scale(0.8);
		transform-origin: 100% 100%;
		border: 1px solid #EEEEEE;
		height: 70rpx;

		.tui-numbox-icon {
			font-size: 35rpx !important;
		}

		.tui-num-input {
			font-size: 35rpx !important;
			height: 70rpx !important;
			display: flex;
			align-items: center;

		}
	}





	.tui-sub-info {
		max-width: 532rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		padding: 20rpx 30rpx 10rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		transform: scale(0.8);
		transform-origin: 100% center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: auto
	}

	.tui-invalid-text {
		width: 66rpx;
		margin-right: 4rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: rgba(0, 0, 0, .3);
		transform: scale(0.8);
		transform-origin: center center;
		border-radius: 4rpx;
		flex-shrink: 0;
	}

	.tui-invalid-pr {
		padding-right: 0 !important;
	}

	.tui-gray {
		color: #B2B2B2 !important;
	}

	.tui-goods-invalid {
		color: #555;
		font-size: 24rpx;
	}

	.tui-flex-center {
		align-items: center !important;
	}

	.tui-invalid-ptop {
		padding-top: 40rpx;
	}

	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		z-index: 99999;
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-checkAll {
		display: flex;
		align-items: center;
	}

	.tui-checkbox-pl {
		padding-left: 12rpx;
	}

	.tui-total-price {
		font-size: 35rpx !important;
		color: #e41f19;
		font-weight: 550;
	}

	/*猜你喜欢*/
	.tui-youlike {
		padding-left: 12rpx;

	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		width: 92%;
		margin: auto;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		
	}

	.bottom-info {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.tui-pro-price {
			padding-top: 18rpx;
		}

		.cart {
			width: 50rpx;
			height: 50rpx;
		}

	}


	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
