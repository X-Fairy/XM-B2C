<template>
	<view>
		<!-- 状态栏 -->
		<view v-if="showHeader" class="status" :style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view>
		<!-- 顶部导航栏 -->
		<view v-if="showHeader" class="header" :style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
			<!-- logo -->
			<view class="addr" @tap="toStore">
				<!-- <image src="../../static/img/logo.png" mode="" class="logo"></image> -->
				<!-- @tap="toStore" -->
				<text>{{storeName}}</text>
				<tui-icon name="position-fill" color="#e84341" size="20"></tui-icon>
			</view>
			<!-- 搜索框 -->
			<view class="input-box">
				<input placeholder="熙美诚品" placeholder-style="color:#c0c0c0;" @tap="toSearch()" />
				<view class="icon search"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>

		<!-- 轮播图 -->
		<view class="swiper">
			<view class="swiper-box" :style="{ height: getheight} ">
				<swiper circular="true" autoplay="true" @change="swiperChange" v-if="swiperList">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">
					<view class="dots" v-for="(swiper, index) in swiperList" :class="[currentSwiper >= index ? 'on' : '']" :key="index"></view>
				</view>
			</view>
		</view>
		<view class='trait'>
			<view class='trait-item'>
				<image src='/static/img/pinpai.png' class='pp-img'></image>品牌保障
			</view>
			<view class='trait-item'>
				<image src='/static/img/baoyou.png' class='pp-img'></image>满59包邮
			</view>
			<view class='trait-item'>
				<image src='/static/img/jisu.png' class='pp-img'></image>急速发货
			</view>
		</view>
		<!-- 分隔条 -->
		<!-- <view class="line"></view> -->
		<!-- 分类列表 -->
		<view class="category-list">
			<view class="category" v-for="(row, index) in categoryList" :key="index" @tap="toCategory(row)">
				<view class="img">
					<image :src="row.icon"></image>
				</view>
				<view class="text">{{ row.cate_name }}</view>
			</view>
		</view>
		<!-- 分隔条 -->
		<!-- <view class="line-one">
		<image src="http://web.xmcpcn.com/img/banner/4.png" mode=""></image> 
		<view class="info">
				<view class="left">
					<text class="txt">抗击疫情</text>
				</view>
				<view class="right">
					<text>一次性购物满<text style="font-weight: 550;font-size: 50upx;">59</text>元包邮！</text>
				</view>
			</view> 
		 </view>
		<view class="info-two"> 
		<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/5.png" mode=""></image>
				<view class="content">
					<text class="title">复工好物</text>
					<text class="sub">第二件半价</text>
					<text class="one-go go">GO></text>
				</view>
			</view> 
		<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/6.png" mode=""></image>
				<view class="content">
					<text class="title">暖冬聚会</text>
					<text class="sub">买一送一</text>
					<text class="two-go go">GO></text>
				</view>
			</view> 
		<view class="part" @tap="toPet()">
				<image src="http://web.xmcpcn.com/img/banner/7.png" mode=""></image>
				<view class="content">
					<text class="title">宠物好礼</text>
					<text class="sub">2件8折</text>
					<text class="three-go go">GO></text>
				</view>
			</view>
			<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/8.png" mode=""></image>
				<view class="content">
					<text class="title">3.8女神</text>
					<text class="sub">66元6.6折</text>
					<text class="four-go go">GO></text>
				</view>
			</view>
		</view> -->
		<view class="line"></view>
		<view class="info-three" style="display: flex;justify-content: space-between;align-items: center;">
			<view class="title">
				<text class="main">限时秒杀</text>
				<text class="line"></text>
				<view class="txt" style="display: flex; align-items: center; font-size: 30rpx; ">倒计时:<tui-countdown :time="seckillTime"
					 bcolor="#fff" :days="true"></tui-countdown>
				</view>
			</view>
			<view class="" style="font-size: 26rpx;color: #b2b2b2;" @tap="toSeckill">
				查看全部<tui-icon name="arrowright" color="#b2b2b2" size="20"></tui-icon>
			</view>
		</view>
		<scroll-view class="scroll-view" scroll-x="true" @bindscroll="scroll" :scroll-left="scrollLeft">
			<view class="scroll-view-item" v-for="(item,index) in seckillList" :key="index">
				<image :src="item.pro_sn" mode="" class="pImg" @tap="toGoods(item)"></image>
				<text class="pTitle title-one" @tap="toGoods(item)">{{item.pro_name}}</text>
				<view class="detail">
					<view class="price" @tap="toGoods(item)">
						<view class="rel"><text style="font-size: 28rpx;">秒杀价:￥</text>{{item.dis_price}}</view>
						<view class="del">原价:￥{{item.pro_price}}</view>
					</view>
					<image src="../../static/img/tabBar/cart-on.png" mode="" class="cart"></image>
				</view>
			</view>
		</scroll-view>
		<!-- <view class="info-four">
			<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/10.png" mode=""></image>
				<view class="txt">
					爆品抢购
				</view>
			</view>
			<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/11.png" mode=""></image>
				<view class="txt">
					9.9元秒杀
				</view>
			</view>
			<view class="part">
				<image src="http://web.xmcpcn.com/img/banner/12.png" mode=""></image>
				<view class="txt">
					19.9元秒杀
				</view>
			</view>
		</view> -->
		<!-- 分隔条 -->
		<view class="line"></view>
		<!-- <view class="info-three">
			<view class="" v-for="(item,index) in actionBanner" :key="index">
				<image :src="item.src" mode="" class="big" @tap="toPage(item)"></image>
			</view>

		</view> -->

		<view class="" v-if="specialList" style="padding-top: 20rpx;">
			<view class="info-three" :key="index" :style="{height:specialImgHeight}">
				<image :src="specialList.img" mode="" class="big" @tap="toPage(specialList)"></image>
			</view>
			<view class="goods-list" v-if="specialList.goods">
				<view class="product-list">
					<view class="product" v-for="(item,index) in specialList.goods" :key="index">
						<image mode="widthFix" :src="item.pro_sn" @tap="toGoods(item)"></image>
						<view class="name title-one" @tap="toGoods(item)">{{ item.pro_name }}</view>
						<view class="info">
							<view class="price-info">
								<view class="price" v-if="item.dis_price!==undefined" @tap="toGoods(item)">
									<text style="font-size: 24rpx;">¥</text>{{ item.dis_price }}
									<text class="dis_price" v-if="item.dis_price!==undefined">{{ item.pro_price }}</text>
								</view>
								<view class="price" v-else @tap="toGoods(item)">
									<text style="font-size: 24rpx;">¥</text>{{ item.pro_price }}
								</view>
								<view class="buy" @tap="tobuy(item)">
									<image src="../../static/img/tabBar/cart-on.png" mode="" class="cart"></image>
									<text class="cartnum" v-if="item.itemcount>0">{{item.itemcount}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="line"></view>
		</view>
		<view class="info-three">
			<view class="title">
				<text class="main">新品上市</text>
				<text class="line"></text>
				<text class="txt">精选好货</text>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(item,index) in productList" :key="index">
					<image mode="widthFix" :src="item.pro_sn" @tap="toGoods(item)"></image>
					<view class="name title-one" @tap="toGoods(item)">{{ item.pro_name }}</view>
					<view class="info">
						<view class="price-info">
							<view class="price" v-if="item.dis_price!==undefined" @tap="toGoods(item)">
								<text style="font-size: 24rpx;">¥</text>{{ item.dis_price }}
								<text class="dis_price" v-if="item.dis_price!==undefined">{{ item.pro_price }}</text>
							</view>
							<view class="price" v-else @tap="toGoods(item)">
								<text style="font-size: 24rpx;">¥</text>{{ item.pro_price }}
							</view>
							<view class="buy" @tap="tobuy(item)">
								<image src="../../static/img/tabBar/cart-on.png" mode="" class="cart"></image>
								<text class="cartnum" v-if="item.itemcount>0">{{item.itemcount}}</text>
							</view>
						</view>


					</view>

				</view>
			</view>
		</view>
		<!-- 分隔条 -->

		<view class="line"></view>
		<view class="info-three">
			<view class="title">
				<text class="main">超值优惠</text>
			</view>
		</view>
		<view class="goodsList">
			<view class="part" v-for="(item,index) in bargainList" :key="index">
				<image mode="widthFix" :src="item.pro_sn" class="goodPic" @tap="toGoods(item)"></image>
				<view class="content">
					<view class="name title-one" @tap="toGoods(item)">{{ item.pro_name }}</view>
					<view class="hot" @tap="toGoods(item)">
						<view class="txt">
							<image src="../../static/img/hot.png" mode="" style="width: 18rpx; height: 20rpx;"></image>hot
						</view>

					</view>
					<view class="info">
						<view class="price" @tap="toGoods(item)" v-if="item.dis_price!==undefined">
							<text style="font-size: 24rpx;">¥</text>{{ item.dis_price }}
							<text class="dis_price" v-if="item.dis_price!==undefined">{{ item.pro_price }}</text>
						</view>
						<view class="price" @tap="toGoods(item)" v-else>
							<text style="font-size: 24rpx;">¥</text>{{ item.pro_price }}
						</view>
						<view class="buy" @tap="tobuy(item)">
							<!-- <text>点击抢购</text> -->
							<image src="../../static/img/tabBar/cart-on.png" mode="" class="cart"></image>
							<text class="cartnum" v-if="item.itemcount>0">{{item.itemcount}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="info-three">
			<view class="title">
				<text class="main">猜你喜欢</text>
			</view>
		</view>
		<view class="goods-list" style="padding-top: 0;">
			<view class="product-list">
				<view class="product" v-for="(item,index) in Promotion" :key="index">
					<image mode="widthFix" :src="item.pro_sn" @tap="toGoods(item)"></image>
					<view class="name title-one" @tap="toGoods(item)">{{ item.pro_name }}</view>
					<view class="info">
						<view class="price-info">
							<view class="price" v-if="item.dis_price!==undefined" @tap=" toGoods(item)">
								<text style="font-size: 24rpx;">¥</text>{{ item.dis_price }}
								<text class="dis_price" v-if="item.dis_price!==undefined">{{ item.pro_price }}</text>
							</view>
							<view class="price" v-else @tap=" toGoods(item)">
								<text style="font-size: 24rpx;">¥</text>{{ item.pro_price }}
							</view>
							<view class="buy" @tap="tobuy(item)">
								<image src="../../static/img/tabBar/cart-on.png" mode="" class="cart"></image>
								<text class="cartnum" v-if="item.itemcount>0">{{item.itemcount}}</text>
							</view>
						</view>

					</view>

				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
		<modal :show="modalShow" @cancel="modalShow=false" :custom="true">
			<view class="popImg" >
				<image :src="popup.img" mode="" @tap="modalShow=false" :style="{height:popHeight+'px'}"></image>
			</view>
		</modal>

	</view>
</template>

<script>
	import QQMapWX from '@/common/utils/qqmap-wx-jssdk.min.js'
	import modal from "@/components/modal/modal"
	import tuiIcon from "@/components/icon/icon"
	import md5 from "@/common/utils/md5.js"
	import tuiCountdown from "@/components/countdown/countdown"
	import {
		ajax,
		getSecret
	} from '@/common/ajax/ajax.js'
	export default {
		components: {
			modal,
			tuiIcon,
			tuiCountdown
		},
		data() {
			return {
				getheight: '',
				specialImgHeight: '',
				storeName: '总部旗舰店',
				address: '',
				city: '',
				id: '',
				secret: {},
				showHeader: true,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: null,
				statusTop: null,
				nVueTitle: null,
				currentSwiper: 0,
				// 轮播图片
				swiperList: [],
				// 活动图片
				actionBanner: [],
				// 分类菜单
				categoryList: [],
				// 限时抢购
				seckillList: [],
				seckillTime: 0,
				bargainList: [],
				Promotion: [],
				//猜你喜欢列表
				productList: [],
				// 活动
				specialList: [],
				loadingText: '到底了',
				amapPlugin: null,
				// 定位弹窗
				modalShow: false,
				storeItems: [{
					store_name: '总部旗舰店',
					desc: '由总部统一发货',
					store_code: '10001'
				}],
				// 门店编码
				store: '10001',
				hint: '熙美诚品',
				popup: {},
				// 向左滑动距离
				scrollLeft: 0,
				// 弹窗高度
				popHeight:0

			};
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getgoods();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			this.getgoods();
			this.getbig();
			this.getLocation();
			
		},
		onShow() {
			// this.onLoad();
			console.log(uni.getStorageSync('store'));
			if (uni.getStorageSync('store')) {
				this.storeName = uni.getStorageSync('store').store_name;
				this.store = uni.getStorageSync('store').store_code
				this.getgoods();

			}

		},
		methods: {
			// 获取商品总分类
			getbig() {
				this.$xm.post('/Procate/getBig','',(res)=>{
					console.log(res);
					this.categoryList=res.splice(1,10);
					console.log(this.categoryList)
				})
				
			},
			
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
				let demo = new QQMapWX({
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
						this.address = res.result.address
						uni.setStorageSync('local', res.result.address);
						// this.getgoods()
						let params = {
							city: this.city,
							from: latitude + ',' + longitude
						}
						this.$xm.post('/Index/getStoreList', params, (res) => {
							this.storeItems = res.data;
							uni.setStorageSync('storeList', res.data)

						})
					},
					fail: function(res) {
						console.log(res)

					},
					complete: function(res) {

					}
				});
			},
			// 获取商品
			getgoods() {
				this.swiperList = []
				var timestamp = (new Date()).getTime();
				var secret = md5.hex_md5("XM#" + md5.hex_md5(String(timestamp)) + "@secret");
				let data = {
					store: this.store,
					secret: timestamp,
					timestamp: secret
				}
				ajax({
					url: '/Index/getInfo',
					method: 'post',
					data: data,
					success: (res) => {
						let result = res.data;
						console.log(result);
						this.popup = result.popup;
						this.popHeight=this.popup.height;
						if (uni.getStorageSync('store')) {
							this.modalShow = false;
						} else {
							if (result.popup.img != '') {
								this.modalShow = true;
							} else {
								this.modalShow = false;
							}
						}
						this.getheight = result.banner[0].height + 'rpx';
						this.specialImgHeight = result.special.height + 'rpx';
						this.hint = result.hint
						uni.setNavigationBarTitle({
							title: this.hint
						});
						this.swiperList = result.banner;
						this.swiperList.map(ele => {
							ele.img = result._URL_ + ele.img
						})
						this.actionBanner = result.img;

						result.faddish.forEach((ele) => {
							ele.itemcount = 0;
							ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';

						})
						this.Promotion = result.faddish;
						this.bargainList = result.bargain;
						this.productList = result.rem;
						this.bargainList.forEach((ele) => {
							ele.itemcount = 0;
							ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
						})
						this.productList.forEach((ele) => {
							ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
							ele.itemcount = 0;
							if (ele.pro_name.length > 8) {}
						})
						result.special.goods.map((ele) => {
							ele.itemcount = 0;
							ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
						})
						this.specialList = result.special;
						this.seckillList = result.seckill;
						this.seckillList.forEach((ele) => {
							ele.pro_sn = 'http://img.xmvogue.com/thumb/' + ele.pro_sn + '.jpg?x-oss-process=style/300';
						})
						this.seckillTime = parseInt(result.seckill[0].etime) - Math.round(new Date() / 1000);
						
						console.log(this.seckillTime);

					}
				})



			},

			scroll(e) {
				this.scrollLeft = e.detail.scrollLeft;
			},
			//搜索跳转
			toSearch() {
				uni.navigateTo({
					url: '../search/search/search'
				})

			},
			// 跳转宠物页
			toPet() {
				// uni.navigateTo({
				// 	url: '../pet/pet/pet'
				// })
			},
			//轮播图跳转
			toSwiper(e) {
				let action = e.src.split('@')
				switch (action[0]) {
					case 'product':
						uni.navigateTo({
							url: '../goods/goods?gid=' + action[1]
						})
						break;
					case 'news':
						uni.navigateTo({

						})
						break;
					case 'sort':

						break;
					case 'player':
						uni.navigateTo({
							url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + action[1]
						})
						break;
					case 'open':
						uni.navigateTo({
							url: "../webViwe/webViwe?url=" + action[1]
						})
						break;
					default:

				}
			},
			// 活动跳转
			toPage(e) {
				console.log(e);
				let action = e.url.split('@');
				console.log(action)
				switch (action[0]) {
					case 'product':
						uni.navigateTo({
							url: '../goods/goods?gid=' + action[1]
						})
						break;
					case 'news':
						// uni.navigateTo({

						// })
						break;
					case 'sort':

						break;
					case 'player':
						uni.navigateTo({
							url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" + action[1]
						})
						break;
					case 'open':
						console.log(1)
						uni.navigateTo({
							url: '../webViwe/webViwe/webViwe?url=' + action[1]
						})
						break;
					default:

				}

			},
			//分类跳转
			toCategory(e) {
				uni.setStorageSync('cateSelect', e.id);
				uni.switchTab({
					url: '../tabBar/category/category'
				})

			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					url: '../goods/goods?gid=' + e.id
				});
			},
			// 秒杀跳转
			toSeckill(){
				uni.navigateTo({
					url:'../seckill/seckill/seckill'
				})
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			tobuy(e) {
				e.itemcount++;
				this.id = e.id;

				this.joinCart();
				// this.toConfirmation();
			},
			// 加入购物车
			joinCart() {
				let data = {
					proid: this.id,
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

			},
			//跳转确认订单页面
			toConfirmation() {
				uni.navigateTo({
					url: '../order/confirmation'
				})
			},
			// 跳转到所有门店页面
			toStore() {
				uni.navigateTo({
					url: '../store/store/store'
				})
			},
			// 跳转活动
			toactivity() {

			}
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
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

	.tui-modal-box {
		padding: 0 !important;
		background: none !important;

		image {
			width: 100%;
			
		}


	}

	.pullDown-effects {
		position: fixed;
		//top: calc(100upx - 36vw);
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		/*  #ifdef  APP-PLUS  */
		padding-top: var(--status-bar-height);

		/*  #endif  */
		image {
			width: 100%;
			height: 36vw;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 94%;
		padding: 0 4%;
		display: flex;
		align-items: center;
		z-index: 10;
		background: #fff;
		top: 0;
		padding-bottom: 10rpx;

		/*  #ifdef  APP-PLUS  */
		// top: var(--status-bar-height);
		/*  #endif  */
		.addr {
			width: 210upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28rpx;

			tui-icon {
				// margin-left: -10upx;
				// margin-top: 10upx;
			}

		}

		.input-box {
			width: 60%;
			margin-top: 10upx;
			height: 60upx;
			background-color: #f3f4f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}

			input {
				padding-left: 20upx;
				height: 28upx;
				font-size: 28upx;
			}
		}

		.icon-btn {
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 80upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.swiper {
		// width: 100%;
		// margin-top: 10rpx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 100%;

			overflow: hidden;
			// border-radius: 15upx;
			// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 100%;

				swiper-item {
					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.indicator {
				position: absolute;
				bottom: 20upx;
				left: 20upx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150upx;
				height: 5upx;
				border-radius: 3upx;
				overflow: hidden;
				display: flex;

				.dots {
					width: 0upx;
					background-color: rgba(255, 255, 255, 1);
					transition: all 0.3s ease-out;

					&.on {
						width: (100%/3);
					}
				}
			}
		}
	}

	.trait {
		display: flex;
		margin: auto;
		align-items: center;
		margin-top: 5upx;
		justify-content: space-between;

		padding: 0 45rpx;
		height: 100rpx;
		background-color: #ffffff;
		box-shadow: 9px 9px 10px 0px rgba(0, 0, 0, 0.05);

		.trait-item {
			display: flex;
			font-size: 24rpx;
			align-items: center;
			color: #222222;

			image {
				width: 35upx;
				height: 35upx;
				margin-right: 10rpx;
			}
		}
	}

	.category-list {
		width: 100%;
		margin: auto;
		padding: 0 0 30upx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.category {
			width: 20%;
			margin-top: 20upx;
			display: flex;
			flex-wrap: wrap;

			.img {
				width: 100%;
				display: flex;
				justify-content: center;

				image {
					width: 14vw;
					height: 14vw;
				}
			}

			.text {
				margin-top: 16upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24upx;
				color: #3c3c3c;
			}
		}
	}

	.line {
		width: 100%;
		height: 20rpx;
		background-color: #f5f5f5;
	}

	.line-one {
		width: 92%;
		height: 215rpx;
		margin: auto;
		position: relative;

		image {
			width: 100%;
			height: 215rpx;
		}

		.info {
			position: absolute;
			display: flex;
			top: 20%;
			width: 80%;
			left: 10%;
			justify-content: space-between;
			align-items: center;

			.left {
				width: 180upx;
				text-align: center;
				padding: 8upx 0;
				background-color: #FFFFFF;
				border-radius: 30upx;
			}

			.txt {
				color: #e84341;
				font-size: 26upx;
			}

			.right {
				color: #fff;
				letter-spacing: 3upx;
			}
		}
	}

	.info-two {
		width: 92%;
		margin: auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.part {
			width: 48%;
			margin-bottom: 25upx;
			height: 210upx;
			position: relative;

			image {
				width: 335rpx;
				height: 210upx;
			}

			.content {
				position: absolute;
				height: 68%;
				top: 16%;
				padding: 0 40upx;

				text {
					display: block;
				}

				.title {
					font-size: 36rpx;
					font-weight: bold;
					color: #ed6967;
					padding-bottom: 15upx;
				}

				.sub {
					font-size: 26rpx;
					padding-bottom: 24upx;
				}

				.go {
					padding-bottom: 0;
					padding: 0 10upx;
					width: 50rpx;
					height: 28rpx;
					line-height: 28rpx;
					background-color: #FFFFFF;
					border-radius: 15rpx;
					font-size: 20rpx;

				}

				.one-go {
					box-shadow: 6rpx 6rpx 6rpx #ed6967;
					color: #ed6967;
				}

				.two-go {
					box-shadow: 6rpx 6rpx 6rpx #ffb445;
					color: #ffb445;
				}

				.three-go {
					box-shadow: 6rpx 6rpx 6rpx #38bbb2;
					color: #38bbb2;
				}

				.four-go {
					box-shadow: 6rpx 6rpx 6rpx #fe6981;
					color: #fe6981;
				}
			}
		}
	}

	.scroll-view {
		white-space: nowrap;
		width: 100%;
		padding-left: 20upx;

		.scroll-view-item {
			display: inline-block;
			width: 40%;
			text-align: left;
			padding: 10rpx 20upx;
			font-size: 24upx;

			.pImg {
				width: 100%;
				height: 300rpx;
				margin-bottom: 16upx;
			}

			.pTitle {
				font-size: 30rpx !important;
			}

			.detail {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.price {
					padding: 20rpx 0;
					text-align: left;
					width: 70%;
					flex-wrap: wrap;

					.rel {
						color: #e65339;
						font-size: 32rpx;
						font-weight: 600;
					}

					.del {
						text-decoration: line-through;
						color: #BEBEBE;
					}
				}

				.icon {
					width: 30upx;
					height: 30upx;
					padding: 15upx;
					text-align: center;
					background-color: #1AAD19;
					border-radius: 50%;
				}
			}
		}
	}

	.info-three {
		width: 92%;
		margin: auto;

		.title {
			display: flex;
			justify-content: left;
			align-items: center;
			padding: 20rpx 0;

			.main {
				font-size: 40rpx;
				color: #323232;
			}

			.line {
				width: 5rpx;
				height: 35rpx;
				background-color: #ed6967;
				display: inline-block;
				margin: 0 10rpx;
			}

			.txt {
				font-size: 28rpx;
				color: #323232;
			}
		}

		.big {
			width: 100%;
			height: 100%;
		}
	}

	.info-four {
		width: 92%;
		margin: 10rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;

		.part {
			width: 33%;
			position: relative;
			height: 180rpx;

			image {
				width: 220rpx;
				height: 180rpx;
			}

			.txt {
				position: absolute;
				top: 19rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				color: #242424;
			}
		}
	}

	.goodsList {
		width: 92%;
		margin: auto;
		display: flex;
		flex-wrap: wrap;
		padding-top: 10px;

		.part {
			width: 100%;
			height: 230rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.goodPic {
				width: 230rpx;
				height: 230rpx;
			}

			.content {
				width: 70%;
				padding: 20rpx 30rpx;
				padding-bottom: 0;

				.name {

					font-family: SourceHanSansCN-Medium;
					font-size: 30rpx;
					color: #323232;
				}

				.hot {
					display: flex;
					margin-top: 20rpx;

					.txt {
						width: 80rpx;
						// height: 26rpx;
						background-color: #e84341;
						border-radius: 13rpx 0rpx 13rpx 0rpx;
						font-size: 24rpx;
						text-align: center;
						color: #FFFFFF;
					}

					.count {
						padding-left: 10rpx;
						font-size: 20rpx;
						color: #e84341;
					}
				}

				.info {
					display: flex;
					justify-content: space-between;
					margin-top: 40rpx;

					.price {
						color: #e84341;
						font-size: 36rpx;

						.dis_price {
							color: #b2b2b2;
							font-size: 30rpx;
							text-decoration: line-through;
							margin-left: 10rpx;
						}
					}

					.buy {
						// width: 150rpx;
						// height: 40rpx;
						// background-color: #e84341;
						// border-radius: 20px;
						// color: #fff;
						// font-size: 20rpx;
						// text-align: center;
						// line-height: 40rpx;
						position: relative;

						.cartnum {
							position: absolute;
							right: -10rpx;
							top: -10rpx;
							display: inline-block;
							width: 30rpx;
							height: 30rpx;
							background-color: red;
							color: #FFFFFF;
							font-size: 25rpx;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}

	.seckill {
		width: 92%;
		margin: auto;
		padding: 10upx 0;
		display: flex;
		justify-content: space-between;
		font-size: 30upx;
		align-items: center;

		.left {
			display: flex;
			justify-content: left;
			align-items: center;

			.left-icon {
				width: 6upx;
				height: 30upx;
				background-color: #f06c7a;
				margin-right: 10upx;
			}

			text {
				font-weight: 550;
				font-family: Yuanti SC;
				letter-spacing: 6upx;
			}

			.countdown {
				margin-left: 20upx;
				display: flex;
				height: 40upx;
				display: flex;
				align-items: center;
				font-size: 20upx;

				view {
					height: 30upx;
					background-color: #f06c7a;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					border-radius: 4upx;
					margin: 0 4upx;
					padding: 0 2upx;
				}
			}
		}

		.more {
			font-size: 20upx;
			opacity: 0.6;
		}
	}

	.scroll-left {
		width: 92%;
		height: 320upx;
		overflow: hidden;
		white-space: nowrap;
		display: flex;
		margin: auto;

		.scroll-item {
			display: inline-block;
			width: 28%;
			height: 320upx;
			margin: 20upx 20upx;
			text-align: left;
			font-size: 25upx;

			.img {
				width: 100%;
				height: 150upx;
				text-align: center;
			}

			.title {
				display: block;
				padding: 12upx 0;
				white-space: normal !important;
			}

			.txt {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 10upx;

				.left {
					.price {
						display: block;
						color: red;
					}

					.slogan {
						font-size: 20upx;
						text-decoration: line-through;
					}
				}


			}
		}
	}

	.cart {
		width: 50upx;
		height: 50upx;
	}

	.promotion {
		padding: 20upx 0;
		width: 92%;
		margin: 0 4%;

		.text {
			width: 100%;
			height: 60upx;
			font-size: 34upx;
			font-weight: 600;
			margin-top: -10upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			border-top: 1px solid #EEEEEE;
			border-bottom: 1px solid #EEEEEE;

			.column:first-child {
				border-left: 1px solid #EEEEEE;
			}

			.column:nth-child(2) {}

			// .column:nth-child(3) {
			// 	background: linear-gradient(top, #e3effe, #f1f8fe);

			// }

			// .column:nth-child(4) {
			// 	background: linear-gradient(top, #fde5db, #f9eee9);

			// }

			.column {
				width: 43%;
				padding: 15upx 3%;
				// border-radius: 10upx;
				border-right: 1px solid #EEEEEE;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding-bottom: 0;

				.top {
					width: 100%;
					display: flex;
					align-items: center;
					margin-bottom: 5upx;

					.title {
						font-size: 26upx;
					}

					.countdown {
						margin-left: 20upx;
						display: flex;
						height: 40upx;
						display: flex;
						align-items: center;
						font-size: 20upx;

						view {
							height: 30upx;
							background-color: #f06c7a;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							border-radius: 4upx;
							margin: 0 4upx;
							padding: 0 2upx;
						}
					}
				}

				.left {
					width: 50%;
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;

					.ad {
						margin-top: 5upx;
						width: 100%;
						font-size: 22upx;
						color: #acb0b0;
					}

					.into {

						font-size: 20upx;
						color: #caa989;
						margin-bottom: 20upx;

						padding: 8upx;
						border-radius: 10upx;
					}
				}

				.right {
					width: 18.86vw;
					height: 18.86vw;

					image {
						width: 18.86vw;
						height: 18.86vw;
					}
				}
			}
		}
	}

	.goods-list {
		padding-top: 10rpx;

		// background-color: #f4f4f4;
		.title {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			color: #f47825;
			font-size: 30upx;
			margin-top: 10upx;

			image {
				width: 30upx;
				height: 30upx;
			}
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

		.product-list {
			width: 92%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				padding-bottom: 10rpx;
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 30rpx 0;
				text-align: left;

				image {
					width: 100%;
				}

				.name {
					width: 100%;
					margin: 10upx 4%;

					font-size: 30upx;
				}

				.info {

					width: 92%;
					padding: 0 4%;

					.price-info {
						display: flex;
						justify-content: space-between;
						align-content: center;

					}

					.price {
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
						font-size: 32rpx;

						.dis_price {
							color: #b2b2b2;
							font-size: 30rpx;
							text-decoration: line-through;
							font-weight: normal;
							margin-left: 10rpx;
						}
					}

					.cart {
						width: 50upx;
						height: 50upx;
					}
				}

				.buy {
					position: relative;
					// width: 100%;
					color: #fff;

					.cartnum {
						position: absolute;
						right: -10rpx;
						top: -10rpx;
						display: inline-block;
						width: 30rpx;
						height: 30rpx;
						background-color: red;
						color: #FFFFFF;
						font-size: 25rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					// text {
					// 	width: 150rpx;
					// 	height: 40rpx;
					// 	background-color: #e84341;
					// 	border-radius: 20px;
					// 	font-size: 20rpx;
					// 	padding: 4rpx 10rpx;
					// }
				}
			}
		}
	}
</style>
