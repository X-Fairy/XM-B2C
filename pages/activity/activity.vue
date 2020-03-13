<template>
	<view>
		<image :src="row.img" mode="widthFix"   v-for="(row,index) in list" :key="index"  @tap="toGoods(row)"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						img:"/static/img/activity/a1.png"
					},{
						img:"/static/img/activity/a2.png"
					},{
						img:"/static/img/activity/a3.png"
					},{
						img:"/static/img/activity/a4.png"
					},{
						img:"/static/img/activity/a5.png"
					},{
						img:"/static/img/activity/a6.png"
					},{
						img:"/static/img/activity/a7.png"
					},{
						img:"/static/img/activity/a8.png"
					},{
						img:"/static/img/activity/a9.png"
					},{
						img:"/static/img/activity/a10.png"
					},{
						img:"/static/img/activity/a11.png"
					},{
						img:"/static/img/activity/a12.png"
					},{
						img:"/static/img/activity/a13.png"
					}
				]
			}
		},
		methods: {
			toGoods(row){
				console.log(row)
			}
		}
	}
</script>

<style>
image{
	width: 100%;
	padding: 0;
	margin: 0;
	display: flex;
}
</style>
