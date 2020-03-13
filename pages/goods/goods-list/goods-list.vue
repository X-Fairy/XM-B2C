<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="input-box">
				<input  placeholder="熙美诚品" placeholder-style="color:#c0c0c0;"  v-model="key"  @blur="toSearch()"/>
				<view class="icon search"></view>
			</view>
			<!-- <view class="btn" :class="key.length>1?'active':''">
				<button >搜索</button>
			</view> -->
		</view>	
		<view class="place">
			
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods,index) in goodsList" :key="index" >
					<image mode="widthFix" :src="goods.pro_sn" @tap="toGoods(goods)"></image>
					<view class="name">{{goods.pro_name}}</view>
					<view class="info">
						<view class="price">{{goods.pro_price}}</view>
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
				key:'',
				secret:'',
				goodsList:[],
				loadingText:"正在加载中...",
				headerTop:"0px",
				headerPosition:"fixed",
				orderbyList:[
					{text:"销量",selected:true,orderbyicon:false,orderby:0},
					{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
					{text:"好评",selected:false,orderbyicon:false,orderby:0}
				],
				orderby:"sheng",
				pageCount:1,
				pageid:1,
			};
		},
		onLoad: function (option) { 
			this.key=option.key
			uni.setNavigationBarTitle({
				title: option.key
			});
			uni.getStorage({
				key:"user",
				success: (res) => {
					this.secret=res.data;
					this.reload();
				}
			})
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
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(()=>{
				this.reload();
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom(){			
			this.pageid++;
			if(this.pageid>this.pageCount){
				this.loadingText="到底了";
				return false;
			}else{
				this.reload();
				this.loadingText="正在加载...";
			}
		},
		methods:{
			reload(){
				let data={
					key: this.key,
					store: 10001,
					xopenid: this.secret.openid,
					pageid: this.pageid,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				}
				this.$xm.post('/Product/search',data,(res)=>{
					if(res.count==0){
						this.loadingText="没有找到您要搜索的商品！";
					}else{
						this.goodsList=res.prolist;
						this.goodsList.map(ele=>{
							ele.pro_sn='http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
							ele.pro_name=ele.pro_name.slice(0,15)+'...'
						})
						this.pageCount=res.count;
						if(this.pageCount==1){
							this.loadingText='到底了'
						}	
					}
									
				})
			},
			toSearch(){
				uni.setNavigationBarTitle({
					title: this.key
				});
				this.reload();
			},
			//商品跳转
			toGoods(e){				
				uni.navigateTo({
					url: '../../goods/goods?gid=' + e.id
				});
			},
			// 加入购物车
			joinCart(e){
				let data={
					proid: e.id,
					pronum: 1,
					xopenid: this.secret.openid,
					store: 10001,
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				}
				this.$xm.post('/Cart/add',data,(res)=>{					
					let result=res.msg;
					if(result=='加入购物车成功'){
						uni.showToast({
							title: "已加入购物车"
						});
					}
					
				})				
			},
			//排序类型
			select(index){
				let tmpTis = this.orderbyList[index].text+"排序 "
				if(this.orderbyList[index].orderbyicon){
					let type = this.orderbyList[index].orderby==0?'升序':'降序';
					if(this.orderbyList[index].selected){
						type = this.orderbyList[index].orderby==0?'降序':'升序';
						this.orderbyList[index].orderby = this.orderbyList[index].orderby==0?1:0;
					}
					tmpTis+=type
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for(let i=0;i<len;i++){
					if(i!=index){
						this.orderbyList[i].selected = false;
					}
				}
				uni.showToast({title:tmpTis,icon:"none"});
			}
		}
		
	}
</script>

<style lang="scss">
	.icon {
		font-size:26upx;
	}
	.header{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items:center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		
		.input-box{
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;
			margin-right: 20upx;
			.icon{
				display: flex;
				align-items: center;
				position: absolute;
				top:0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}
			input{
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}
		.btn{
			width: 140upx;
			// height: 60upx;
			button{				
				font-size: 28upx;
				border:0;
				border-radius: 50upx !important;
			}
		}
		.active{
			button{
				background-color: red;
				color: white;
			}
			
		}		
		.target{
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;
			&.on{
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
			
			
		}
	}
.place{
		
		background-color: #ffffff;
		height: 100upx;

	}
.goods-list{
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 92%;
			padding: 0 4% 3vw 4%; 
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 20rpx 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 10upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
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
