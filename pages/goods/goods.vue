<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<view class="header">
			<!-- 头部-默认显示 -->
			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="back">
					<view class="icon xiangqian" @tap="back" v-if="showBack"></view>
				</view>
				<view class="middle"></view>
				<view class="icon-btn">
					<!-- <view class="icon tongzhi" @tap="toMsg"></view> -->
					<view class="icon cart" @tap="joinCart"></view>
				</view>
			</view>
			<!-- 头部-滚动渐变显示 -->
			<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
				<view class="back">
					<view class="icon xiangqian" @tap="back" v-if="showBack"></view>
				</view>
				<view class="middle">
					<view v-for="(anchor,index) in anchorlist" :class="[selectAnchor==index ?'on':'']" :key="index" @tap="toAnchor(index)">{{anchor.name}}</view>
				</view>
				<view class="icon-btn">

					<view class="icon cart" @tap="joinCart"></view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box" @tap="share">
					<view class="icon fenxiang"></view>
					<view class="text">分享</view>
				</view>
				<view class="box" style="padding-left: 20rpx;">
					<button open-type="contact" class="chat-btn" style="background-color: #FFFFFF;
						border: none;
						line-height: inherit;padding-left: 5rpx;align-self: center;
">
						<view class="icon kefu"></view>
						<view class="text">客服</view>
					</button>
				</view>
				<view class="box" @tap="cart">
					<view class="icon cart"></view>
					<view class="text">购物车</view>
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="buy">立即购买</view>
			</view>
		</view>
		<view class="bottom">

		</view>
		<!-- share弹窗 -->
		<view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="h1">分享</view>
				<view class="list">
					<button class="shareBtn" open-type="share">
						<view class="box" style="width: 100%;">
							<image src="../../static/img/share/wx.png"></image>
							<view class="title">
								微信好友
							</view>
						</view>
					</button>

					<view class="box" @tap="createCanvasImageEvn">
						<image src="../../static/img/share/pyq.png"></image>
						<view class="title">
							朋友圈海报
						</view>
					</view>

				</view>
				<view class="btn" @tap="hideShare">
					取消
				</view>
			</view>

		</view>
		<!-- 服务-模态层弹窗 -->
		<view class="popup service" :class="serviceClass" @touchmove.stop.prevent="discard" @tap="hideService">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="row" v-for="(item,index) in goodsData.service" :key="index">
						<view class="title">{{item.name}}</view>
						<view class="description">{{item.description}}</view>
					</view>
				</view>
				<view class="btn">
					<view class="button" @tap="hideService">完成</view>
				</view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="discard" @tap="hideSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="title">选择规格：</view>
					<view class="sp">
						<view v-for="(item,index) in goodsData.spec" :class="[index==selectSpec?'on':'']" @tap="setSelectSpec(index)"
						 :key="index">{{item}}</view>
					</view>
					<view class="length" v-if="selectSpec!=null">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub">
								<view class="icon jian"></view>
							</view>
							<view class="input" @tap.stop="discard">
								<input type="number" v-model="goodsData.number" />
							</view>
							<view class="add" @tap.stop="add">
								<view class="icon jia"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn">
					<view class="button" @tap="hideSpec">完成</view>
				</view>
			</view>
		</view>
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper.img"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">{{currentSwiper+1}}/{{swiperList.length}}</view>
		</view>
		<!-- 秒杀 -->
		<view class="seckill" v-if="secShow">
			<view class="secPrice">
				秒杀价:￥<text style="font-weight: bold;font-size: 34rpx;">{{secPrice}}</text>
			</view>
			<view class="time">
				<text>距结束仅剩:</text><tui-countdown :time="endTime" bcolor="#fff" :days="true" :isColon="false"></tui-countdown>
			</view>
		</view>
		<view class="seckill" v-if="nextShow">
			<view class="secPrice">
				秒杀价:￥<text style="font-weight: bold;font-size: 34rpx;">{{secPrice}}</text>
			</view>
			<view class="time">
				<text>距开始还有:</text><tui-countdown :time="startTime" bcolor="#fff" :days="true" :isColon="false"></tui-countdown>
			</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box one-info">
			<view class="goods-info">
				<view class="title">{{goodsData.name}}</view>
				<view class="price" v-if="goodsData.disPrice">￥{{goodsData.disPrice}}<text style="font-size: 28rpx;text-decoration: line-through;color: #b2b2b2;margin-left: 15rpx;">{{goodsData.price}}</text></view>
				<view class="price" v-else>
					￥{{goodsData.price}}
				</view>
			</view>
			<view class="right-info">
				<tui-icon name="star-fill" color="#e84341" size="20" v-if="isKeep" @tap="dellike"></tui-icon>
				<tui-icon name="star" color="#b2b2b2" size="20" v-else @tap="like"></tui-icon>
				<view class="two" @tap="like">收藏</view>
			</view>
		</view>

		<!-- 服务-规则选择 -->
		<view class="info-box spec">
			<!-- <view class="row" @tap="showSpec(false)">
				<view class="text">规格选择</view>
				<view class="arrow">
					<view class="icon xiangyou"></view>
				</view>
			</view> -->
			<view class="row">
				<view class="text">购买数量</view>
				<view class="arrow">
					<tui-numberbox :value="value" @change="change"></tui-numberbox>
				</view>
			</view>
			<view class="row" @tap="showService">
				<view class="text">服务：</view>
				<view class="content">
					<view class="serviceitem" v-for="(item,index) in goodsData.service" :key="index">{{item.name}}</view>
				</view>
				<view class="arrow">
					<view class="icon xiangyou"></view>
				</view>
			</view>

		</view>
		<!-- 评价 -->
		<view class="info-box comments" id="comments" style="display: none;">
			<view class="row">
				<view class="text">商品评价({{goodsData.comment.number}})</view>

				<view class="arrow" @tap="toRatings">
					<view class="show" @tap="showComments(goodsData.id)">
						查看全部
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="toRatings">
				<view class="user-info">
					<view class="face">
						<image :src="goodsData.comment.userface"></image>
					</view>
					<view class="username">{{goodsData.comment.username}}</view>
					<tui-rate :current="current" active-color="#FFCA3E"></tui-rate>
				</view>
				<view class="content">
					{{goodsData.comment.content}}
				</view>
				<view class="time">
					2020-012-27 16:27
				</view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content">
				<rich-text :nodes="descriptionStr"></rich-text>
			</view>
		</view>
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData" />
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas><!-- 海报 -->
		</view>
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiNumberbox from "@/components/numberbox/numberbox.vue"
	import tuiRate from "@/components/rate/rate"
	import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue'
	import tuiCountdown from "@/components/countdown/countdown"
	import {
		ajax,
		getSecret
	} from '@/common/ajax/ajax.js'
	export default {

		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.goodsData.name,
				imageUrl: this.swiperList[0].img,
				path: 'pages/goods/goods?gid=' + this.goodsData.id,
				success: (res) => {
					console.log(res);
				},
				fail: (res) => {
					console.log(res);
				}
			}
		},
		components: {
			tuiNumberbox,
			tuiRate,
			hchPoster,
			tuiIcon,
			tuiCountdown
		},
		data() {
			return {
				// 商品ID
				id: '',
				secret: '',
				timestamp: '',
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11, //层级
				afterHeaderzIndex: 10, //层级
				beforeHeaderOpacity: 1, //不透明度
				afterHeaderOpacity: 0, //不透明度
				//是否显示返回按钮
				// #ifndef MP
				showBack: true,
				// #endif
				//轮播主图数据
				swiperList: [{}],
				//轮播图下标
				currentSwiper: 0,
				anchorlist: [], //导航条锚点
				selectAnchor: 0, //选中锚点
				serviceClass: '', //服务弹窗css类，控制开关动画
				specClass: '', //规格弹窗css类，控制开关动画
				shareClass: '', //分享弹窗css类，控制开关动画
				// 商品信息
				goodsData: {
					id: '',
					name: "",
					price: "",
					disPrice: '',
					number: 1,
					service: [{
							name: "7天无忧退货",
							description: "此商品官方保证7天退货"
						},
						{
							name: "满59包邮",
							description: "此商品享受满59包邮"
						},
						{
							name: "2个工作日退款",
							description: "此商品享受退货极速退款服务"
						},
						{
							name: "熙美诚品自营",
							description: "熙美诚品原创生活类品牌，所有商品均为熙美诚品自营，品质保证"
						}
					],
					spec: ["XS", "S", "M", "L", "XL", "XXL"],
					comment: {
						number: 0,
						userface: '../../static/img/face.jpg',
						username: '未上线',
						content: '商品评论还未上线，敬请期待！'
					}
				},
				selectSpec: null, //选中规格
				isKeep: false, //收藏
				//商品描述html
				descriptionStr: '',
				// 购买数量
				value: 1,
				// 好评几颗星
				current: 4,
				xopenid: '',
				deliveryFlag: false,
				canvasFlag: true,
				posterData: {},
				// 是否开始秒杀
				secShow:false,
				endTime:0,
				// 秒杀价格
				secPrice:0,
				// 下一场秒杀
				nextShow:false,
				startTime:0
			};
		},
		onLoad(option) {

			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;
			// #endif
			var text = getSecret();
			this.secret = text.secret;
			this.timestamp = text.timestamp;
			this.gid = option.gid;
			this.getDetails();


		},
		onShow() {

			uni.getStorage({
				key: 'user',
				success: (res) => {
					this.xopenid = res.data.openid;

				}
			});
		},
		onReady() {
			this.calcAnchor(); //计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
		},
		onPageScroll(e) {
			//锚点切换
			this.selectAnchor = e.scrollTop >= this.anchorlist[2].top ? 2 : e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			//切换层级
			this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {

		},
		mounted() {},
		methods: {
			// 获取商品详情
			getDetails() {
				let data={
					id: this.gid,
				
				};
				this.$xm.post('/Product/getInfo',data,(res)=>{
					let result = res;
					this.goodsData.id = result.id;
					this.goodsData.price = result.pro_price;
					this.goodsData.name = result.pro_name;
					this.goodsData.disPrice = result.dis_price;
					this.secPrice=result.sec_price;
					if (result.keep) {
						this.isKeep = true
					} else {
						this.isKeep = false
					}
					if(result.nextstart){
						this.nextShow=true;
						this.startTime = parseInt(result.nextstart) - Math.round(new Date() / 1000);
					}else{
						this.nextShow=false
					}
					if(result.etime){
						this.secShow=true;
						this.endTime = parseInt(result.etime) - Math.round(new Date() / 1000);
					}else{
						this.secShow=false;
					}
					this.swiperList[0].img = 'http://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/' + result.pro_sn +
						'.jpg?x-oss-process=style/440';
					this.descriptionStr = '<div style="text-align:center;"><img width="100%" src="http://img.xmvogue.com/detail/' +
						result.pro_sn + '-.jpg?x-oss-process=style/800"/></div>'
				})
				
			},
			// 收藏
			like() {
				let data = {
					proid: this.gid
				};
				this.$xm.post('/Collect/addcollect', data, (res) => {
					if (res.msg == '添加成功!') {
						this.isKeep = true;
						uni.showToast({
							title: '收藏成功'
						})
					}
					console.log(res);
				})
			},
			dellike() {
				uni.showModal({
					title: '确定取消收藏吗？',
					content: '',
					confirmText: '取  消',
					cancelColor: '#b2b2b2',
					confirmText: '确  定',
					confirmColor: '#2c2c2c',
					success: (res) => {
						if (res.confirm) {
							let data = {
								id: this.gid
							}
							this.$xm.post('/Collect/delcollect', data, (res) => {
								console.log(res);
								if (res.code == 2000) {
									this.isKeep = false;
									uni.showToast({
										title: '删除成功'
									})
								}
							})
						}
					},
				})
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			// 调整购买数量
			change(e) {
				this.value = e.value;
				console.log(this.value);
				if (this.value < 1) {
					this.value = 1;
					uni.showToast({
						title: "亲，不能再见少了",
						icon: 'none'
					});
				}
			},
			// 购物车
			cart() {
				uni.switchTab({
					url: '../tabBar/cart/cart'
				})
			},
			// 分享
			share() {
				this.shareClass = 'show';
			},
			hideShare() {
				this.shareClass = 'hide';
				setTimeout(() => {
					this.shareClass = 'none';
				}, 150);
			},
			createCanvasImageEvn() {
				this.shareClass = 'hide';
				Object.assign(this.posterData, {
					url: this.swiperList[0].img, //商品主图
					title: this.goodsData.name, //标题
					discountPrice: this.goodsData.disPrice || 0, //折后价格
					orignPrice: this.goodsData.price, //原价
					code: 'pages/details/details?gid=' + this.gid, //小程序码
					id: this.gid,
					close: '../../static/img/close_btn.png'

				})
				this.$forceUpdate(); //强制渲染数据
				setTimeout(() => {
					this.canvasFlag = false; //显示canvas海报
					this.deliveryFlag = false; //关闭分享弹窗
					this.$refs.hchPoster.createCanvasImage(); //调用子组件的方法
				}, 500)

			},
			// 取消海报
			canvasCancel(val) {
				this.canvasFlag = val;
				this.getDetails();
			},
			// 加入购物车
			joinCart() {
				let data = {
					proid: this.gid,
					pronum: this.value,
				};
				this.$xm.post('/Cart/add', data, (res) => {
					let result = res.msg;
					if (result == '加入购物车成功') {
						uni.showToast({
							title: "已加入购物车"
						});
					}
				})

			},
			//立即购买
			buy() {
				this.joinCart();
				this.toConfirmation();
			},
			//商品评论
			toRatings() {
				uni.navigateTo({
					url: './ratings/ratings'
				})
			},
			//跳转确认订单页面
			toConfirmation() {
				uni.navigateTo({
					url: '../order/confirmation'
				})
			},
			//跳转评论列表
			showComments(goodsid) {

			},
			//选择规格
			setSelectSpec(index) {
				this.selectSpec = index;
			},
			//减少数量
			sub() {
				if (this.goodsData.number <= 1) {
					return;
				}
				this.goodsData.number--;
			},
			//增加数量
			add() {
				this.goodsData.number++;
			},
			//跳转锚点
			toAnchor(index) {
				this.selectAnchor = index;
				uni.pageScrollTo({
					scrollTop: this.anchorlist[index].top,
					duration: 200
				});
			},
			//计算锚点高度
			calcAnchor() {
				this.anchorlist = [{
						name: '主图',
						top: 0
					},
					{
						name: '评价',
						top: 0
					},
					{
						name: '详情',
						top: 0
					}
				]
				let commentsView = uni.createSelectorQuery().select("#comments");
				commentsView.boundingClientRect((data) => {
					console.log(data);
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
					statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(100);
					this.anchorlist[0].top = data.top - headerHeight - statusbarHeight;
					this.anchorlist[1].top = data.bottom - headerHeight - statusbarHeight;

				}).exec();
			},
			//返回上一页
			back() {
				uni.navigateBack();
			},
			//服务弹窗
			showService() {

				this.serviceClass = 'show';
			},
			//关闭服务弹窗
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 200);
			},
			//规格弹窗
			showSpec(fun) {

				this.specClass = 'show';
				this.specCallback = fun;
			},
			specCallback() {
				return;
			},
			//关闭规格弹窗
			hideSpec() {
				this.specClass = 'hide';
				//回调

				this.selectSpec && this.specCallback && this.specCallback();
				this.specCallback = false;
				setTimeout(() => {
					this.specClass = 'none';
				}, 200);
			},
			discard() {

			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}

	.shareBtn {
		background-color: #F2F2F2 !important;
		padding: 0 !important;
		margin: 0 !important;
		line-height: inherit;
		width: 50% !important;
	}

	.shareBtn::after {
		border: 0 !important;
	}

	@keyframes showPopup {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes hidePopup {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes showLayer {
		0% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-100%);
		}
	}

	@keyframes hideLayer {
		0% {
			transform: translateY(-100%);
		}

		100% {
			transform: translateY(0);
		}
	}

	.icon {
		font-size: 26upx;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #f1f1f1;
		transition: opacity 0.05s linear;
	}

	.header {
		width: 100%;

		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			transition: opacity 0.05s linear;

			.back {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;

				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42upx;
				}
			}

			.middle {
				width: 100%;
			}

			.icon-btn {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;

				.icon {
					&:first-child {
						margin-right: 5upx;
					}

					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 42upx;
				}
			}
		}

		.before {
			.back {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}

			.icon-btn {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;

				}
			}
		}

		.after {
			background-color: #f1f1f1;

			.back {
				.icon {
					color: #666;
				}
			}

			.icon-btn {
				.icon {
					color: #666;
				}
			}

			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 7%;

				view {
					width: (100%/3);
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;

					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #f47952;
					}
				}
			}
		}
	}

	.swiper-box {
		position: relative;
		width: 100%;
		height: 100vw;

		swiper {
			width: 100%;
			height: 100vw;

			swiper-item {
				image {
					width: 100%;
					height: 100vw;
				}
			}
		}

		.indicator {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 25upx;
			height: 40upx;
			border-radius: 40upx;
			font-size: 22upx;
			position: absolute;
			bottom: 20upx;
			right: 20upx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}
	.seckill{
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-image: linear-gradient(right, #EB5155, #E9797F);
		font-size: 30rpx;
		.secPrice{
			color: #FFFFFF;
		}
		.time{
			background-color: #FFFFFF;
			border-radius: 100rpx;
			padding: 15rpx 20rpx;
			color: #EB5155;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			text{
				white-space:nowrap
			}
		}
	}
	.info-box {
		width: 92%;
		padding: 20upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.one-info {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		border-top: 1px solid #EEEEEE;
	}

	.goods-info {
		width: 75%;
		border-right: 1px solid #EEEEEE;

		.price {
			font-size: 36upx;
			font-weight: 500;
			color: #e84341;
			padding-top: 20upx;
		}

		.title {
			font-size: 30upx;
		}
	}

	.right-info {
		width: 25%;
		text-align: center;

		.two {
			font-size: 24upx;
			color: #757575;
		}

		.three {
			margin: auto;
			margin-top: 12upx;
			color: #757575;
			width: 100upx;
			font-size: 24upx;
			padding: 8upx 0;
			border-radius: 20upx;
			border: 1px solid #EEEEEE;
		}
	}

	.spec {
		.row {
			width: 100%;
			display: flex;
			align-items: center;
			// margin: 0 0 30upx 0;
			border-bottom: 1px solid #EEEEEE;
			padding: 25upx 0;

			.text {
				font-size: 24upx;
				color: #6C6C6C;
				margin-right: 20upx;
			}

			.content {
				font-size: 28upx;
				display: flex;
				flex-wrap: wrap;
				align-items: center;

				.serviceitem:first-child,
				.serviceitem:nth-child(2) {
					padding-bottom: 15upx;
				}

				.serviceitem {
					margin-right: 10upx;
					width: 45%;
					text-align: center;
					font-size: 24upx;
				}

				.sp {
					width: 100%;
					display: flex;

					view {
						background-color: #f6f6f6;
						padding: 5upx 10upx;
						color: #999;
						margin-right: 10upx;
						font-size: 20upx;
						border-radius: 5upx;

						&.on {
							border: solid 1upx #f47952;
							padding: 4upx 8upx;
						}
					}
				}
			}

			.arrow {
				position: absolute;
				right: 4%;

				.icon {
					color: #ccc;
				}
			}
		}
	}

	.comments {
		.row {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			margin: 0 0 30upx 0;
			border-bottom: 1px solid #EEEEEE;
			padding-bottom: 20rpx;

			.text {
				font-size: 30upx;
			}

			.arrow {
				font-size: 24upx;
				position: absolute;
				right: 4%;
				color: #757575;

				.show {
					display: flex;
					align-items: center;

					.icon {
						color: #757575;
					}
				}
			}
		}

		.comment {
			width: 100%;

			.user-info {
				width: 100%;
				height: 60upx;
				display: flex;
				align-items: center;

				.face {
					width: 60upx;
					height: 60upx;
					margin-right: 8upx;

					image {
						width: 60upx;
						height: 60upx;
						border-radius: 100%;
					}
				}

				.username {
					font-size: 24upx;
					color: #999;
					margin-right: 16upx;
				}
			}

			.content {
				padding: 16upx 0;
				font-size: 26upx;
			}

			.time {
				font-size: 24upx;
				color: #C0C0C0;
				padding-top: 10upx;
			}
		}
	}

	.description {
		padding-bottom: 100rpx;
		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
	}

	.bottom {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		height: 20rpx;
		background-color: #fff;
	}

	.footer {
		position: fixed;
		bottom: 20rpx;
		width: 92%;
		padding: 0 4%;
		height: 99upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.icons {
			display: flex;
			height: 80upx;
			// margin-left: -4%;

			.box {
				width: 80upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				.icon {
					font-size: 40upx;
					color: #828282;
				}

				.text {
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 22upx;
					color: #666;
				}

				button::after {
					border: none !important;
				}
			}
		}

		.btn {
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			margin-right: -2%;

			.joinCart,
			.buy {
				height: 80upx;
				padding: 0 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				font-size: 28upx;
			}

			.joinCart {
				background-color: #f0b46c;
			}

			.buy {
				background-color: #f06c7a;
			}
		}
	}

	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		display: none;

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}

		.layer {
			position: fixed;
			z-index: 22;
			bottom: -70%;
			width: 92%;
			padding: 0 4%;
			height: 70%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;

			.content {
				width: 100%;
				padding: 20upx 0;
			}

			.btn {
				width: 100%;
				height: 100upx;

				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		&.service {
			.row {
				margin: 30upx 0;

				.title {
					font-size: 30upx;
					margin: 10upx 0;
				}

				.description {
					font-size: 28upx;
					color: #999;
				}
			}
		}

		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}

			.sp {
				display: flex;

				view {
					font-size: 28upx;
					padding: 5upx 20upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;

					&.on {
						padding: 3upx 18upx;
						border: solid 1upx #f47925;
					}
				}
			}

			.length {
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;

				.text {
					font-size: 30upx;
				}

				.number {
					display: flex;
					justify-content: center;
					align-items: center;

					.input {
						width: 80upx;
						height: 60upx;
						margin: 0 10upx;
						background-color: #f3f3f3;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;

						input {
							width: 80upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;
							text-align: center;
							font-size: 26upx;
						}
					}

					.sub,
					.add {
						width: 60upx;
						height: 60upx;
						background-color: #f3f3f3;
						border-radius: 5upx;

						.icon {
							font-size: 30upx;
							width: 60upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}

		}
	}

	.share {
		display: none;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.15s linear both;
			}

			.layer {
				animation: showLayer 0.15s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.15s linear both;
			}

			.layer {
				animation: hideLayer 0.15s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			background-color: rgba(0, 0, 0, .5);
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 11;
		}

		.layer {
			width: 92%;
			position: fixed;
			z-index: 12;
			padding: 0 4%;
			top: 100%;
			background-color: rgba(255, 255, 255, 0.9);

			.list {
				width: 100%;
				display: flex;
				padding: 10upx 0 30upx 0;
				justify-content: space-between;

				.box {
					width: 50%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					image {
						width: 13.8vw;
						height: 13.8vw;
					}

					button::after {
						border: none !important;
					}

					.title {
						margin-top: 10upx;
						display: flex;
						justify-content: center;
						width: 100%;
						font-size: 26upx;
					}
				}
			}

			.btn {
				width: 100%;
				height: 100upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28upx;
				border-top: solid 1upx #666666;
			}

			.h1 {
				width: 100%;
				height: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 34upx;
			}
		}
	}
</style>
