<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
				<view class="tab-bar-item" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="showType(grid.sort)">
					<text class="text" :class="[grid.sort==tabbarIndex?'on':'']">{{grid.name}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length==0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>
				<view class="row" v-for="(row,index) in list" :key="index">
					<view>
						<!-- <view class="number">{{row.store_name}}</view> -->
						<view class="type">订单号：{{row.order_sn}}({{row.tips}})
							<view class="icon shanchu" @tap="del(row)"></view>
						</view>
						<view class="order-info" @tap="toOrderDtl(row.order_sn)">
							<view class="left">
								<view class="imgList" v-for="(item,i) in row.pro" :key="i">
									<image :src="item.pro_img"></image>
								</view>
							</view>

						</view>
						<view class="detail">							
							<view class="number">共{{row.pro.length}}件商品</view>
							<view class="sum">合计￥<view class="price">{{row.allprice}}</view>
							</view>
							<view class="nominal">(含运费 ￥{{row.order_ship_price}})</view>
						</view>
					</view>
					<view class="btns">

						<block>
							<view class="default" @tap="buyAgain(row)">再次购买</view>
						</block>
						<block v-if='row.order_state=="0"||row.order_state=="1"'>
							<view class="default" @tap="edit(row)">修改地址</view>
						</block>
						<block v-if='row.order_state=="1"||row.order_state=="2"'>
							<view class="pay" @tap="modalShow(row)">申请退款</view>
						</block>

						<block v-if="row.order_state=='0'">
							<view class="pay" @tap="toPayment(row)">付款</view>
						</block>
						<!-- <block v-if="row.order_state=='已付款'">
							<view class="default" @tap="remindDeliver(row)">提醒发货</view>
						</block>
						<block v-if="row.order_state=='配货中'">
							<view class="default" @tap="showLogistics(row)">查看物流</view>
							<view class="pay">确认收货</view>
							<view class="pay">我要退货</view>
						</block>
						<block v-if="row.order_state=='已发货'">
							<view class="default">评价</view>
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.order_state=='作废'">
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.order_state=='已删除'">
							<view class="default">已取消</view>
						</block>
						<block v-if="row.order_state=='退款订单'">
							<view class="default">再次购买</view>
						</block> -->
					</view>					
				</view>
				<view class="loading-text" v-if="list.length>0">{{ loadingText }}</view>
			</view>
			
		</view>
		<tui-modal :show="txtmodal" @cancel="txtmodal=false" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="tui-prompt-title">退款原因</view>
				<input placeholder="请输入退款原因" class="tui-input" v-model="txt" />
				<button shape="circle" @tap="refund" size="small" type="warn">立即提交</button>
			</view>
		</tui-modal>
	</view>
</template>
<script>
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiModal
		},
		data() {
			return {
				secret: {},
				pageid: 1,
				status: '',
				headerPosition: "fixed",
				headerTop: "0px",
				orderType: [{
					name: '全部',
					sort: 's',
				}, {
					name: '未付款',
					sort: '0'
				}, {
					name: '已付款',
					sort: '1'
				}, {
					name: '配货中',
					sort: '2'
				}, {
					name: '已发货',
					sort: '3'
				}, {
					name: '已收货',
					sort: '4'
				}, {
					name: '已作废',
					sort: '5'
				}, {
					name: '已删除',
					sort: '6'
				}, {
					name: '已退款',
					sort: '8'
				}],
				//订单列表 演示数据
				orderList: [],
				list: [],
				tabbarIndex: 0,
				scrollLeft: 0, //tab标题的滚动条位置
				txt: '', //退款原因
				// 退款弹框
				txtmodal: false,
				refundList:[],
				loadingText:'正在加载中...'
			};
		},
		onLoad(option) {
			this.tabbarIndex = option.tbIndex;
			uni.getStorage({
				key: 'user',
				success: (res) => {
					this.secret = res.data;
					this.getlist();
				}
			})

			//兼容H5下排序栏位置
			// #ifdef H5
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
		},
		onShow() {

		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
		},
		methods: {
			// 获取订单
			getlist() {
				let data = {
					xopenid: this.secret.openid,
					pageid: this.pageid,
					status: this.tabbarIndex != "s" ? this.tabbarIndex : '',
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				};

				this.$xm.post('/Order/getList', data, res => {

					if (res.orderlist.length > 0) {
						res.orderlist.forEach(ele => {
							this.$xm.requestImg(ele.pro);

							switch (ele.order_state) {
								case '0':
									ele.tips = '未付款'
									break;
								case '1':
									ele.tips = '已付款'
									break;
								case '2':
									ele.tips = '配货中'
									break;
								case '3':
									ele.tips = '已发货'
									break;
								case '4':
									ele.tips = '已收货'
									break;
								case '5':
									ele.tips = '已作废'
									break;
								case '6':
									ele.tips = '已删除'
									break;
								case '7':
									ele.tips = '已退款'
									break;
								case '8':
									ele.tips = '已退款'
									break;
								default:

							}
						})
					}
					this.list = res.orderlist;
					this.loadingText='到底了'
				})
			},
			// 切换导航 
			showType(tbIndex) {
				if (!tbIndex) {
					tbIndex = "s"
				}
				this.tabbarIndex = tbIndex;
				this.getlist();
			},
			// 跳转详情页
			toOrderDtl(e) {
				console.log(e);
				uni.navigateTo({
					url: './orderDtl/orderDtl?id=' + e
				})
			},
			showLogistics(row) {

			},
			//再次购买
			buyAgain(row) {
				let data = {
					xopenid: this.secret.openid,
					ordersn: row.order_sn,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				};

				this.$xm.post('/Order/buyAgain', data, res => {
					if (res.s == 1) {
						uni.navigateTo({
							url: '../../order/confirmation'
						})
					}
				})
			},
			// 修改地址
			edit(row) {
				uni.navigateTo({
					url: './orderEdit/orderEdit?sn=' + row.order_sn
				})
			},
			modalShow(row){
				this.txtmodal=true;
				this.refundList=row;
			},
			// 退款
			refund() {
				console.log(this.refundList);
				this.txtmodal = false;
				let that = this;
				uni.showModal({
					title: '确定要申请退款吗',
					content: '申请后不可恢复',
					success: (res) => {
						if (res.confirm) {
							let params = {
								status: 7,
								xopenid: this.secret.openid,
								ordersn: this.refundList.order_sn,
								secret: this.secret.secret,
								timestamp: this.secret.timestamp,
								memo: this.txt
							}
							this.$xm.post('/Order/changeStatus', params, eve => {
								if (eve.s == 1) {
									uni.showToast({
										title: '申请成功'
									})
									setTimeout(function() {
										that.getlist()
									}, 500)
								} else {
									uni.showToast({
										title: '申请失败'
									})
								}
							})
						} else if (res.cancel) {
							uni.showToast({
								title: '申请失败'
							})
						}
					}
				});


			},
			del(row) {
				let data = {
					xopenid: this.secret.openid,
					ordersn: row.order_sn,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp,
					status: '6'
				}
				this.$xm.post('/Order/changeStatus', data, (res) => {
					console.log(res);
					if (res.s == 1) {
						this.getlist();
						uni.showToast({
							title: '删除成功'
						})
					} else {
						uni.showToast({
							title: '删除失败'
						})
					}
				})
			},
			remindDeliver(row) {
				uni.showToast({
					title: '已提醒商家发货'
				})
			},
			cancelOrder(row) {
				uni.showModal({
					title: '取消订单',
					content: '确定取消此订单？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.doCancelOrder(row.ordersn);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			doCancelOrder(ordersn) {
				let typeNum = this.orderList.length;
				for (let i = 0; i < typeNum; i++) {
					let list = this.orderList[i];
					let orderNum = list.length;
					if (orderNum > 0 && list[0].type == 'unpaid') {
						for (let j = 0; j < orderNum; j++) {
							if (this.orderList[i][j].ordersn == ordersn) {
								this.orderList[i][j].type = 'cancelled';
								break;
							}
						}
					}

				}
			},
			// 付款
			toPayment(row) {

				let params = {
					xopenid: this.secret.openid,
					order_sn: row.order_sn,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				}
				this.$xm.post('/Order/rePay', params, res => {
					if (res.s == 1) {
						let data = res.data
						uni.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(res) {
								console.log(res)
							},
							fail: function(res) {
								console.log(res)
							},
							complete: function(res) {
								if (res.errMsg == 'requestPayment:ok') {
									uni.showModal({
										title: '支付成功！',
										content: '',
										showCancel: false,
										confirmText: '确  定',
										confirmColor: '#2c2c2c',
										success: function(res) {
											that.getlist()
										}
									})
								} else {
									uni.showModal({
										title: '支付失败！',
										content: '',
										showCancel: false,
										confirmText: '确  定',
										confirmColor: '#2c2c2c',
										success: function(res) {
											if (res.confirm) {

											}
										}
									})
								}

							}
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})

			},
			toPage() {
				uni.navigateTo({
					url: './orderDtl/orderDtl'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;

	}
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.tui-modal-custom {
		text-align: center;
		font-size: 35rpx;

		.tui-prompt-title {
			margin-bottom: 20rpx;
		}

		.tui-input {
			margin: 30rpx 40rpx;
			border-bottom: 1rpx solid #E6E6E6;
			padding-bottom: 20rpx;
			font-size: 32rpx;
		}
	}

	.topTabBar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #f8f8f8;
		height: 80upx;
		display: flex;
		justify-content: space-around;

		.tab-view::before {
			content: '';
			position: absolute;
			border-bottom: 1upx solid #eaeef1;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			bottom: 0;
			right: 20rpx;
			left: 0;
		}

		.tab-view {
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;
			top: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			left: 0;
			z-index: 99;
			background: #fff;
			white-space: nowrap;
			padding: 0 20rpx;


			.tab-bar-item {
				margin: 0 20upx;
				display: inline-block;
				text-align: center;
				box-sizing: border-box;

				.text {
					height: 76upx;
					display: flex;
					align-items: center;

					&.on {
						color: #f06c7a;
						border-bottom: solid 4upx #f06c7a;
					}
				}

				.tab-bar-title {
					font-size: 24upx;
					font-weight: 400;
				}
			}

			.active {
				border: 1px solid #e84341;

				.tab-bar-title {
					color: #e84341 !important;
					font-size: 28upx;
				}
			}
		}

	}

	.order-list {
		margin-top: 80upx;
		padding-top: 20upx;
		width: 100%;

		.list {
			width: 94%;
			margin: 0 auto;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				width: calc(100% - 40upx);
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.type {
					font-size: 26upx;
					color: #000;
					height: 50upx;
					display: flex;
					align-items: center;
					padding-bottom: 10rpx;
					justify-content: space-between;

					.icon {
						font-size: 35rpx;
						color: #646464;
					}
				}

				.order-info {
					width: 100%;
					display: flex;
					overflow: hidden;

					.left {
						flex-shrink: 0;
						width: 25vw;
						height: 25vw;
						display: flex;

						image {
							width: 25vw;
							height: 25vw;
							border-radius: 10upx;
							margin-left: 15rpx;
						}
					}

					.right {
						width: 100%;
						margin-left: 10upx;
						position: relative;

						.name {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.spec {
							color: #a7a7a7;
							font-size: 22upx;

						}

						.price-number {
							position: absolute;
							bottom: 0;
							width: 100%;
							display: flex;
							justify-content: flex-end;
							font-size: 22upx;
							color: #333;
							display: flex;
							align-items: flex-end;

							.price {
								font-size: 24upx;
								margin-right: 5upx;
							}

						}
					}
				}

				.detail {
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60upx;
					font-size: 26upx;

					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}
</style>
