<template>
	<view class="page-body">
		<view class="page-section page-section-gap">
			<web-view :src="url" v-if="status"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				status: false
			}
		},
		onLoad(options) {
			console.log(options);
			this.url=options.url;
			this.status=true
		},
		onShow() {
			let options={
				url:this.url
			}
			this.onLoad(options)
		},
		methods: {
		
		}
	}
</script>

<style>

</style>
