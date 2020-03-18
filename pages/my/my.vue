<template>
	<view class="container">
		<div id="app">
			<cmd-avatar :src="url" :size="100"></cmd-avatar>
			<div class="my-name">{{name}}</div>
			<div class="history">我的报修</div>

		</div>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: uni.getStorageSync('userInfo').nickName,
				url:uni.getStorageSync('userInfo').avatarUrl
			};
		},
		methods: {

		},
		mounted() {
			
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.my-image {
		border-radius: 50% 50%;
		height: 30px;
		width: 30px;
	}

	.my-name {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		margin-top: 40px;
		justify-content: center;
	}

	.history {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100px;
		border-radius: 20px;
		background: #F0F0F0;
		height: 30px;
	}

	.history:active {
		background: #D1DBE5;
	}
</style>
