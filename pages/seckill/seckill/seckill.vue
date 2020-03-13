<template>
	<view>
		<view class="status" :style="{position:headerPosition}"></view>
		<view class="header" :style="{position:headerPosition}">
			<view v-for="(item,index) in timeList" :key="index" :class="tabIndex==index?'active':'part'" @tap="changeList(item,index)">
				<view class="time">{{item.time}}</view>
				<view class="state">{{item.state}}</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods,index) in goodsList" :key="index">
					<image mode="widthFix" :src="goods.pro_sn" @tap="toGoods(goods)"></image>
					<view class="name title-one">{{goods.pro_name}}</view>
					<view class="info">
						<view class="" style="text-align: left;">
							<view class="secprice"><text style="font-size: 26rpx;">秒杀价:￥</text>{{goods.sec_price}}</view>
							<view class="price"><text>原价:￥</text>{{goods.pro_price}}</view>
						</view>
						
						<image src="../../../static/img/tabBar/cart-on.png" mode="" class="cart" @tap="joinCart(goods)"></image>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headerPosition: "fixed",
				tabIndex: 0,
				timeList: [],
				goodsList:[],
				stime:'',
				etime:''
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
			
		},
		onShow() {
			this.getTime()
		},
		methods: {
			getTime(){
				this.$xm.post('/Index/seckill','',(res)=>{					
					res.data.forEach(ele=>{
						if(ele.status==1){
							ele.state='倒计时';
							let t=this.$xm.changeTime(ele.etime*1000)
							ele.time=t.slice(5,t.length);
						}else if(ele.status==2){
							ele.state='即将开始';
							let t=this.$xm.changeTime(ele.stime*1000)
							ele.time=t.slice(5,t.length);
						}
					})
					console.log(res.data);
					this.timeList=res.data;
					this.stime=res.data[0].stime;
					this.etime=res.data[0].etime;
					this.getGoodS()
				})
			},
			getGoodS(){
				let data={
					stime:this.stime,
					etime:this.etime
				}
				this.$xm.post('/Index/seckillpro',data,(res)=>{
					this.goodsList=res.data;
					this.goodsList.forEach(ele=>{
						ele.pro_sn='http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300'
					})
				})
			},
			changeList(e,i){
				this.stime=e.stime;
				this.etime=e.etime;
				this.tabIndex=i;
				this.getGoodS()
			},
			toGoods(goods){
				uni.navigateTo({
					url:'../../goods/goods?gid='+goods.id
				})
			},
			joinCart(goods){
				let data = {
					proid: goods.id,
					pronum: 1,
				};
				this.$xm.post('/Cart/add', data, (res) => {
					let result = res.msg;
					if (result == '加入购物车成功') {
						uni.showToast({
							title: "已加入购物车"
						});
					}
					this.$xm.post('/Cart', '', res => {
						uni.setStorage({
							key: 'cart',
							data: res.count,
							success: (res) => {
								uni.getStorage({
									key: 'cart',
									success: (res) => {
										let count = res.data;
										if (res.data !== null) {
											count = count.toString();
											uni.setTabBarBadge({
												index: 2,
												text: count
											})
										}
									}
								})
							}
						})
					})
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		top: 0;
		z-index: 10;
		flex-wrap: nowrap;
		color: #FFFFFF;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.part,
		.active {
			width: 100%;
			text-align: center;
			padding: 15rpx 0;
			background-color: #626262;
			font-size: 28rpx;

			.state {
				color: #b2b2b2;
				font: 24rpx;
			}
		}

		.active {
			background-color: #e84341;

			.state {
				color: #FFFFFF;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 120upx;

	}

	.goods-list {
		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.product-list {
			width: 92%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 20rpx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				image {
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

				.name {
					// width: 92%;
					padding: 0 4%;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					.secprice{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
					.price {
						font-size: 26upx;
						color: #b2b2b2;
					}

					.cart {
						width: 50upx;
						height: 50upx;
					}
				}
			}

		}
	}
</style>
