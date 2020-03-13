<template>
	<view>
		<view class="status" :style="{position:headerPosition}"></view>
		<!-- 头部搜索框 -->
		<view class="header" :style="{position:headerPosition}">
			<view class="input-box">
				<input placeholder="熙美诚品" placeholder-style="color:#c0c0c0;" v-model="key" />
				<view class="icon search"></view>
			</view>
			<view class="btn" :class="key.length>1?'active':''">
				<button @tap="toSearch()">搜索</button>
			</view>
		</view>
		<view class="place">
		</view>
		<!-- 历史记录 -->
		<view class="history" v-if="historyList.length>0">
			<view class="title">
				<text>历史记录</text>
				<view class="icon-btn">
					<view class="icon shanchu" @tap="del"></view>
				</view>
			</view>
			<view class="content">
				<view class="keywords" v-for="(item,index) in historyList" :key="index" @tap="to(item)">
					<text class="word">{{item}}</text>
				</view>
			</view>
		</view>
		<view class="hot">
			<text>热门搜索</text>
			<view class="content">
				<view class="keywords" v-for="(item,index) in hotList" :key="index" @tap="to(item)">
					<text class="word">{{item}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				secret: {},
				headerPosition: "fixed",
				key: '',
				historyList: [],
				hotList: []
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: (res) => {
					this.secret = res.data;
					this.getkey();
				}
			})
		},
		onShow() {
			uni.getStorage({
				key: 'searchWord',
				success: (res) => {
					console.log(res.data);
					this.historyList=res.data;
				}
			})
		},
		methods: {
			// 获取关键词
			getkey() {
				let data = {
					secret: this.secret.secret,
					timestamp: this.secret.timestamp
				};
				this.$xm.post('/Product/getSearchKey', data, (res) => {
					this.hotList = res;
				})
			},
			to(e){
				uni.navigateTo({
					url:'../../goods/goods-list/goods-list?key='+e
				})
			},
			toSearch() {
				uni.navigateTo({
					url:'../../goods/goods-list/goods-list?key='+this.key
				})
				this.historyList.unshift(this.key);
				this.historyList=Array.from(new Set(this.historyList));
				this.key='';
				uni.setStorage({
					key: 'searchWord',
					data: this.historyList,
					success: (res) => {
						
					},
					fail: (e) => {
						
					}
				})
			},
			del() {
				this.historyList = [];
				uni.setStorage({
					key: 'searchWord',
					data: this.historyList,
					success: (res) => {
						
					},
					fail: (e) => {
						
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
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

	.place {
		background-color: #ffffff;
		height: 100upx;
	}

	.header {
		width: 100%;
		padding: 15upx 4% 15upx;
		height: 60upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.input-box {
			width: 70%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;
			margin-right: 20upx;

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
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}

		.btn {
			width: 140upx;
			button {
				font-size: 28upx;
				border: 0;
				border-radius: 50upx !important;
			}
			button::after {
				border:none !important;
			}
			
		}

		.active {
			button {
				background-color: red;
				color: white;
			}

		}
	}

	.history,
	.hot {
		padding: 4%;
		position: relative;
		// top: 110upx;
		background-color: white;
		font-size: 28upx;

		.title {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.icon-btn {
				.icon {
					font-size: 32upx !important;
					font-weight: 400;
				}
			}
		}

		.content {
			padding-top: 10upx;
			display: flex;
			align-items: center;
			justify-content: left;
			flex-wrap: wrap;

			.keywords {
				margin-right: 20upx;
				margin-bottom: 20upx;
				text-align: center;
				padding: 15upx 20upx;
				background-color: #F6F6F6;
				border-radius: 30upx;

				.word {}
			}

		}
	}

	.hot {
		padding-top: 20upx !important;
	}
</style>
