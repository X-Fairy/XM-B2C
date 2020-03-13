<template>
	<view>
		<view class="part-one">
			<image src="../../../static/img/pet-banner.png" mode=""></image>
			<view class="content">
				<h1>宠物好礼</h1>
				<p>一个人的时光，总会显得有些无聊与孤独</p>
				<p>一个以宠物之名存在的生物</p>
				<p>却总像家人一样给我们温暖</p>
				<p>让平凡的日子闪闪发亮</p>
				<p>每个铲屎官都和萌宠有着说不清的深厚情感</p>
				<p>我们特此推出<text>【宠爱有加，好礼相送】</text>宠爱活动</p>
				<p>多款宠爱单品等你来购~</p>
			</view>
			<view class="productList">
				<view class="product">
					<image src="../../../static/img/7125.png" mode=""></image>
					<view class="good-info">
						<text class="title">小型犬狗粮1.5kg</text>
						<view class="details">
							<text>营养膳食均衡</text>
							<text>毛飘逸亮泽</text>
							<text>淡化眼睛泪痕</text>
							<text>呵护肠胃健康</text>
							<text style="width: 100%;">壮骨补钙助力发育</text>
						</view>
						<view class="price-buy">
							<view class="price">
								<text>¥<text>45</text></text>
							</view>
							<view class="buy"><text>立即购买</text></view>
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
				secret: '',
				timestamp: '',
			}
		},
		onLoad() {
			uni.getStorage({
				key:'user',
				success: (res)=> {
					console.log(res);
					this.secret=res.secret;
					this.timestamp=res.timestamp;
				}
			})
		},
		methods: {
			getproList(){
				let data={
					big: 1,
					mid: 11,					
					store: '',
					secret: this.secret,
					timestamp: this.timestamp
				}
				// $xm.post('/Product/proList',)
			}
		}
	}
</script>

<style lang="scss">
	.part-one {
		width: 100%;

		image {
			width: 100%;
			height: 330rpx;
		}

		.content {
			width: 100%;
			text-align: center;
			padding: 50rpx 0;

			h1 {
				font-size: 72rpx;
				color: #e8b50a;
				padding-bottom: 10rpx;
			}

			p {
				font-size: 24rpx;
				line-height: 48rpx;

				text {
					color: #ecb81d;
				}
			}
		}

		.productList {
			width: 100%;
			background-color: #ffe3f0;

			.product {
				margin-bottom: 20rpx;
				position: relative;
				height: 559rpx;

				image {
					width: 100%;
					height: 559rpx;
				}

				.good-info {
					width: 370rpx;
					top: 23%;
					position: absolute;
					padding-left: 50rpx;

					.title {
						font-size: 40rpx;
						font-weight: 550;
						line-height: 48px;
						color: #000000;

					}

					.details {
						width: 100%;
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						padding-bottom: 100rpx;

						text {
							width: 50%;
							font-size: 24rpx;
							line-height: 40rpx;
						}

					}

					.price-buy {
						display: flex;
						align-items: center;
						justify-content: left;

						.price {
							font-size: 36rpx;
							color: #1e43bc;
							margin-right: 25rpx;
						}

						.buy {
							width: 78rpx;
							height: 78rpx;
							line-height: 78rpx;
							background-color: #1e43bc;
							border-radius: 20rpx;
							color: #FFFFFF;
							text-align: center;
							font-size: 25rpx;
							text {
								display: block;
							}
						}
					}
				}
			}
		}
	}
</style>
