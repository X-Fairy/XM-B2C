<template>
	<!-- 海报(想让海报显示隐藏要用hidden，v-if关闭后没办法在完整的出来海报) 保存海报按钮和关闭按钮 在html代码中写出来 绑定点击方法然后透明 再用canvas 覆盖 -->
	<view class="canvas_box" :hidden="canvasFlag">
		<view class="canvas_box_mask"></view><!-- 遮罩 -->
		<icon type="cancel" class="canvas_close_btn" size="60" @tap="canvasCancelEvn" color="transparent" /><!-- 关闭 -->
		<view class="button-wrapper">
			<!-- 保存海报按钮 -->
			<cover-view class="save_btn" @tap="saveCanvasImage"></cover-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			canvasFlag: {
				type: Boolean,
				default: true,
			},
			posterObj: {
				type: null,
				default: {
					url: '', //商品主图
					icon: '', //会员价图标
					title: "", //标题
					discountPrice: "", //折后价格
					orignPrice: "", //原价
					code: '', //小程序码
				}
			}
		},
		methods: {
			// 海报
			// 画圆角矩形 ctx、x起点、y起点、w宽度、h高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
			roundRect(ctx, x, y, w, h, r, fillColor, strokeColor, btn) {
				// 开始绘制
				ctx.beginPath()
				// 绘制左上角圆弧 Math.PI = 180度
				// 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
				// 绘制border-top
				// 移动起点位置 x终点、y终点
				ctx.moveTo(x + r, y)
				// 画一条线 x终点、y终点
				ctx.lineTo(x + w - r, y)
				// 绘制右上角圆弧
				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
				// 绘制border-right
				ctx.lineTo(x + w, y + h - r)
				// 绘制右下角圆弧

				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

				// 绘制左下角圆弧

				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

				// 绘制border-left
				ctx.lineTo(x, y + r)
				if (btn == 'btn') {
					const grd = ctx.createLinearGradient(0, 0, 200, 0) //渐变色
					grd.addColorStop(0, fillColor)
					grd.addColorStop(1, strokeColor)
					// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
					ctx.setFillStyle(grd)
					// 对绘画区域填充
					ctx.fill()
				} else {

					if (fillColor) {
						// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
						ctx.setFillStyle(fillColor)
						// 对绘画区域填充
						ctx.fill()
					}
					if (strokeColor) {
						// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
						ctx.setStrokeStyle(strokeColor)
						// 画出当前路径的边框
						ctx.stroke()
					}
				}
				// 关闭一个路径
				ctx.closePath()
				// 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
				ctx.clip()
			},

			/**
			 * canvas绘图相关，把文字转化成只能行数，多余显示省略号
			 * ctx: 当前的canvas
			 * text: 文本
			 * contentWidth: 文本最大宽度
			 * lineNumber: 显示几行
			 */
			canvasMultiLineText(ctx, text, contentWidth, lineNumber) {
				var textArray = text.split(""); // 分割成字符串数组
				var temp = "";
				var row = [];
				for (let i = 0; i < textArray.length; i++) {
					if (ctx.measureText(temp).width < contentWidth) {
						temp += textArray[i];
					} else {
						i--; // 这里添加i--是为了防止字符丢失
						row.push(temp);
						temp = "";
					}
				}
				row.push(temp);

				// 如果数组长度大于2，则截取前两个
				if (row.length > lineNumber) {
					console.log(row.length,lineNumber)
					var rowCut = row.slice(0, lineNumber);
					console.log(row);
					var rowPart = row[0];
					console.log(rowPart)
					var test = "";
					var empty = [];
					for (var a = 0; a < rowPart.length; a++) {
						if (ctx.measureText(test).width < contentWidth) {
							test += rowPart[a];
						} else {
							break;
						}
					}
					empty.push(test); // 处理后面加省略号
					var group = empty[0] + '...'
					rowCut.splice(lineNumber - 1, 1, group);
					row = rowCut;
				}
				return row;
			},
			// 获取海报的小程序码 -->



			// 生成海报
			createCanvasImage() {				
				uni.showLoading({
					title: '海报生成中...'
				})
				let _this = this;
				let phoneData = uni.getSystemInfoSync();
				this.phoneH = phoneData.windowHeight;
				this.phoneW = phoneData.windowWidth;
				let scaleW = this.phoneW / 375; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				let scaleH = this.phoneH / 667; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				const ctx = uni.createCanvasContext('myCanvas');
				let url = this.posterObj.url; //商品主图
				console.log(this.posterObj)
				let zpPriceIcon = this.posterObj.icon //图标
				let code = this.posterObj.code
				let closeBtn = this.posterObj.close
				ctx.draw() //清空原来的画图内容
				ctx.save();
				this.roundRect(ctx, 50, 40, (this.phoneW - 100), (this.phoneH - 200), 10, '#fff', '#fff'); //绘制海报圆角背景白色的
				ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
				ctx.save();
				this.roundRect(ctx, 50, 40, (this.phoneW - 100), (340) * scaleH, 10, '#f7f7f7', '#f7f7f7'); //绘制海报圆角背景 上半截灰色的
				ctx.restore();
				url = 'https' + url.slice(4, url.length);
				
				//将网络图片转成本地路径 商品图片
				uni.getImageInfo({
					src: url,
					success(res) {
						ctx.save();
						console.log(res.path, 1);
						_this.posterObj.url = res.path;
						_this.roundRect(ctx, (_this.phoneW - ((_this.phoneW - 130))) / 2, 55, (_this.phoneW - 130), 250 * scaleH, 10,
							'#f7f7f7', '#f7f7f7')
						ctx.drawImage(_this.posterObj.url, (_this.phoneW - ((_this.phoneW - 130))) / 2, 55, (_this.phoneW - 130), 250 *
							scaleH, 10); //绘制图
						ctx.restore();
						ctx.draw(true)
					},
					fail(err) {
						console.log(err);
					}
				})

				// 关闭按钮
				// uni.getImageInfo({
				// 	src: closeBtn,
				// 	success(res) {
				// 		closeBtn=res.path;
				// 		ctx.drawImage(closeBtn, 50 + (_this.phoneW - 100) + 5, 40, 24, 24)
				// 		ctx.draw(true)
				// 	},
				// 	fail(err) {
				// 		_this.canvasFlag = true;
				// 		console.log(err);
				// 	}
				// })
				ctx.drawImage(closeBtn, 50 + (_this.phoneW - 100) + 5, 40, 24, 24)
				ctx.draw(true)
				// 关闭按钮 end
				// 海报商品title
				setTimeout(() => {
					ctx.setGlobalAlpha(1) //不透明
					ctx.setFillStyle('#1c1c1c') //文字颜色：默认黑色
					ctx.setFontSize(14) //设置字体大小，默认10
					ctx.font = 'normal bold 14px sans-serif';
					let text = this.posterObj.title;
					let row = this.canvasMultiLineText(ctx, text, (this.phoneW - 130), 1); //计算绘制的2行文本
					let contentTextY = 350; // 这段文字起始的y位置
					let leftSpace = 65; // 这段文字起始的X位置
					let textLineHeight = 18; // 一行文字加一行行间距
					for (let b = 0; b < row.length; b++) { //一行一行绘制文本
						ctx.fillText(row[b], leftSpace, (contentTextY + textLineHeight * b - 15) * scaleH, (this.phoneW - 130));
						ctx.draw(true)
					}
				}, 500)
				// 海报商品title end

				//绘制价格
				ctx.setFontSize(12) //设置字体大小，默认10
				ctx.setFillStyle('#c00000') //文字颜色：默认黑色
				ctx.font = 'normal 12px sans-serif';
				ctx.fillText('￥', 60, 360 * scaleH, 60);
				ctx.setFontSize(16) //设置字体大小，默认10
				console.log(this.posterObj.discountPrice);
				let orignPrice;
				let zpPrice
				if (this.posterObj.discountPrice == 0) {
					orignPrice = this.posterObj.discountPrice; //会员价格
					zpPrice = this.posterObj.orignPrice; //市场价	
					let zpPriceW = ctx.measureText(zpPrice).width; //文本的宽度
					ctx.fillText(zpPrice, 70, 360 * scaleH, zpPriceW);
				} else {
					zpPrice = this.posterObj.discountPrice; //会员价格
					orignPrice = this.posterObj.orignPrice; //市场价	
					let zpPriceW = ctx.measureText(zpPrice).width; //文本的宽度
					ctx.fillText(zpPrice, 70, 360 * scaleH, zpPriceW);
					ctx.beginPath(); //开始一个新的路径
					ctx.setFontSize(13) //设置字体大小，默认10
					ctx.setFillStyle('#999') //文字颜色：默认黑色
					let orignPriceW = ctx.measureText(orignPrice).width //去掉市场价
					ctx.fillText(orignPrice, 70 + zpPriceW + 5, 360 * scaleH, orignPriceW); //5价格间距
					ctx.moveTo(70 + zpPriceW + 5, 355 * scaleH); //设置线条的起始路径坐标
					ctx.lineTo(70 + zpPriceW + 5 + orignPriceW, 355 * scaleH); //设置线条的终点路径坐标
					ctx.setStrokeStyle('#999')
					ctx.stroke(); //对当前路径进行描边
					ctx.closePath(); //关闭当前路径
				}
				//绘制价格 end
				let id = this.posterObj.id
				uni.request({
					url: "https://dh.xmvogue.com/index.php/API/Index/sharecode", //域名省略	
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						path: code, //想要生成小程序码的页面地址
						id: id

					},
					method: 'POST',
					success: function(res) {
						let img = 'https' + res.data.slice(4, res.data.length) + "?x-oss-process=style/300";
						console.log(img)
						uni.getImageInfo({
							src: img,
							success(res) {
								console.log(res);
								_this.posterObj.code = res.path;
								ctx.drawImage(_this.posterObj.code, (_this.phoneW - 80) / 2, 390 * scaleH, 80, 80)
								// ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
								ctx.draw(true)
							},
							fail(err) {
								console.log(err);
							}
						})

					},
					fail: function(err) {
						console.log(err);
					},

				})


				// 小程序码end
				// 小程序的名称
				ctx.setFontSize(14)
				ctx.setFillStyle('#2f1709') //文字颜色：默认黑色
				ctx.font = 'normal bold 14px sans-serif';
				// ctx.fillText('小程序的名称', (_this.phoneW - 90) / 2, 530 * scaleH, 90);
				// 小程序的名称end
				// 长按/扫描识别查看商品
				ctx.setFontSize(14)
				ctx.setFillStyle('#ff5f33') //文字颜色：默认黑色
				ctx.font = 'normal 14px sans-serif';
				ctx.fillText('长按/扫描识别查看商品', (_this.phoneW - 140) / 2, 490 * scaleH, 140);
				// 长按/扫描识别查看商品end
				//绘制保存按钮
				ctx.save();
				this.roundRect(ctx,(this.phoneW-160)/2,(this.phoneH-140),160, 36,18,'#ff3600','#ff6a00','btn')
				ctx.restore(); 
				ctx.setFontSize(14)
				ctx.setFillStyle('#fff')//文字颜色：默认黑色
				ctx.font = 'normal bold 14px sans-serif';
				ctx.fillText('保存图片', (_this.phoneW-58)/2, (this.phoneH-118),58);
				//绘制保存按钮 end
				uni.hideLoading();
			},

			// 保存到系统相册
			saveCanvasImage() {
				uni.showLoading({
					title: '保存中...'
				})
				let _this = this;
				// 1-把画布转化成临时文件
				uni.canvasToTempFilePath({
					x: 50,
					y: 40,
					width: (this.phoneW - 100), // 画布的宽
					height: (this.phoneH - 120), // 画布的高
					destWidth: (this.phoneW - 100) * 5,
					destHeight: (this.phoneH - 120) * 5,
					canvasId: 'myCanvas',
					success(res) {
						// 2-保存图片至相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res2) {								
								uni.showToast({
									title: '图片保存成功!',
									duration: 2000
								})
								uni.hideLoading();
								_this.canvasCancelEvn();
							},
							fail(err) {
								console.log(err);
								uni.showToast({
									title: '保存失败，稍后再试',
									duration: 2000,
									icon: 'none'
								})
								// uni.hideLoading();
							}
						})
					},
					fail(err) {
						uni.showToast({
							title: '保存失败，稍后再试111',
							duration: 2000,
							icon: 'none'
						})
						console.log(err);
						uni.hideLoading();
					}
				})
			},
			// 取消海报
			canvasCancelEvn() {
				this.$emit('cancel', true)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		text-align: center;
		height: 100%;
	}

	.canvas_box {
		.canvas_box_mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 9;
		}

		.canvas {
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			display: block !important;
			width: 100% !important;
			height: 100% !important;
			z-index: 9;
		}

		.button-wrapper {
			width: 320rpx;
			height: 72rpx;
			position: absolute;
			bottom: 190rpx;
			left: 215rpx;
			z-index: 16;
		}

		.save_btn {
			font-size: 30rpx;
			line-height: 72rpx;
			color: #fff;
			width: 100%;
			height: 100%;
			text-align: center;
			border-radius: 45rpx;
			border-radius: 36rpx;
			z-index: 10;
		}

		.canvas_close_btn {
			position: fixed;
			top: 30rpx;
			right: 0;
			z-index: 12;

		}
	}
</style>
