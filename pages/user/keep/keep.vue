<template>
	<view>		
		<view class="list">
			<view class="sub-list goods" :class="subState">
				<view class="tis" v-if="goodsList.length==0">没有数据~</view>
				<view class="row" v-for="(row,index) in goodsList" :key="index" >
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteCoupon(row.id)">
						<view class="icon shanchu"></view>
					</view>
					<!-- content -->
					<view class="carrier" :class="[typeClass=='goods'?theIndex==index?'open':oldIndex==index?'close':'':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
						<view class="goods-info" @tap="toGoods(row)">
							<view class="img">
								<image :src="row.pro_img"></image>
							</view>
							<view class="info">
								<view class="title">{{row.pro_name}}</view>
								<view class="price-number">
									<!-- <view class="keep-num">
										905人收藏
									</view> -->
									<view class="price">￥{{row.pro_price}}</view>
									
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>

	export default {
		data() {
			return {
				goodsList:[],				
				headerTop:0,
				//控制滑动效果
				typeClass:'goods',
				subState:'',
				theIndex:null,
				oldIndex:null,
				isStop:false
			}
		},
		onPageScroll(e){
			
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			//兼容H5下排序栏位置
			// #ifdef H5
				//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
				let Timer = setInterval(()=>{
					let uniHead = document.getElementsByTagName('uni-page-head');
					if(uniHead.length>0){
						this.headerTop = uniHead[0].offsetHeight+'px';
						clearInterval(Timer);//清除定时器
					}
				},1);
			// #endif
		},
		onShow() {
			this.getList();
		},
		methods: {
			// 获取收藏列表
			getList(){
				this.$xm.post('/Collect/index','',(res)=>{
					console.log(res);
					this.goodsList=res.data;
					this.$xm.requestImg(this.goodsList)
				})
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			
			touchEnd(index,$event){
				//解除禁止触发状态
				this.isStop = false;
			},
			
			//删除商品
			deleteCoupon(id){
				uni.showModal({
					title: '确定取消收藏吗？',
					content: '',
					confirmText: '取  消',
					cancelColor: '#b2b2b2',
					confirmText: '确  定',
					confirmColor: '#2c2c2c',
					success: (res) => {
						if (res.confirm) {
							let data={
								id: id
							}
							this.$xm.post('/Collect/delcollect',data,(res)=>{
								this.oldIndex = null;
								this.theIndex = null;
								console.log(res);
								if(res.code==2000){
									this.isKeep=false;
									uni.showToast({
										title:'删除成功！'
									})
									this.getList()
								}
							})
						}
					},
				})
			},
			
			toGoods(row){
				uni.navigateTo({
					url:'../../goods/goods?gid='+row.id
				})
			}
			
			
		}
	}
</script>
<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		
	}
	page{position: relative;background-color: #ffff;}

	.hidden{
		display: none !important;
	}
	.place{
		width: 100%;
		height: 95upx;
	}
	.tabr{
		background-color: #fff;
		width: 94%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		position: fixed;
		top: 0;
		z-index: 10;
		view{
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}
		.on{
			color: #f06c7a;
		}
		.border{
			height: 4upx;
			background-color: #f06c7a;
			transition: all .3s ease-out;
			&.shop{
				transform: translate3d(100%,0,0);
			}
		}
		
	}
	.list{
		width: 100%;
		display: block;
		position: relative;
	}
	@keyframes showGoods {
		0% {transform: translateX(-100%);}100% {transform: translateX(0);}
	}
	@keyframes showShop {
		0% {transform: translateX(0);}100% {transform: translateX(-100%);}
	}
	.sub-list{
		&.shop{
			position: absolute;
			top: 0;
			left:100%;
			display: none;
		}
		&.showgoods{
			display: flex;
			animation: showGoods 0.20s linear both;
		}
		&.showshop{
			display: flex;
			animation: showShop 0.20s linear both;
		}
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		&.shop{
			.row{
				height: 20vw;
				.left{
					width: 20vw;
					height: 20vw;
					padding-left: 20upx;
					align-items: center;
					image{
						width: 18vw;
						height: 18vw;
						border-radius: 100%;
					}
				}
				.right{
					height: 20vw;
					align-items: center;
					font-size: 32upx;
				}
			}
		}
		.row{
			width: 100%;
			height: 30vw; 
			align-items: center;
			position: relative;
			overflow: hidden;
			border-bottom: solid 1upx #dedede;
			.menu{
				.icon{
					color: #fff;
					font-size:50upx;
				}
				position: absolute;
				width: 20%;
				height: 100%;
				right: 0;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-28%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-28%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;
				.goods-info{
					width: calc(100% - 40upx);
					padding: 20upx;
					flex-wrap: nowrap;
					.img{
						width: calc(30vw - 40upx);
						height: calc(30vw - 40upx);
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 20upx;
						image{
							width: calc(30vw - 40upx);
							height: calc(30vw - 40upx);
						}
					}
					.info{
						width: 100%;
						height: calc(30vw - 40upx);
						overflow: hidden;
						flex-wrap: wrap;
						align-content: space-between;
						position: relative;
						.title{
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.price-number{
							width: 100%;
							justify-content: space-between;
							align-items: baseline;
							
							.keep-num{
								font-size: 26upx;
								color: #999;
							}
							.price{
								font-size: 30upx;
								color: #f06c7a;
							}
						}
					}
				}
			}

		}
	}
	
</style>
