<template>
	<view class="content white">
		<view class="picWrapper">
			<image class="picMode" style="width: 100px;height:100px;" src="../../static/img/baoxiupic.png"></image>
			<text class="baoxiuText">报修管家</text>
		</view>
		<view class="btn-row">
			<button class="loginButton" type="primary" @click="validateToken">微信用户一键登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: '',
				password: ''
			}
		},
		methods: {
			validateToken() {
				uni.showLoading({
					title: '登录中...'
				})
				uniCloud.callFunction({
					name: 'validateToken',
					data: {
						token: uni.getStorageSync('token') // token最好不要每次从storage内取，本示例为了简化演示代码才这么写
					}
				}).then((res) => {
					this.loginMp()
					// console.log(res);
					// uni.hideLoading()
					// uni.showModal({
					// 	content: res.result.msg,
					// 	showCancel: false
					// })
				}).catch((err) => {
					this.loginMp()
					uni.hideLoading()
					uni.showModal({
						content: '请求云函数发生错误，' + err.message,
						showCancel: false
					})
				})
			},
			loginMp() {
				uni.showLoading({
					title: '登录中...'
				})
				this.getCode().then((code) => {
					console.log('code', code);
					return uniCloud.callFunction({
						name: 'login',
						data: {
							code
						}
					})
				}).then((res) => {
					uni.hideLoading()
					console.log(res);
					if (res.result.status !== 0) {
						return Promise.reject(new Error(res.result.msg))
					}
					uni.setStorageSync('token', res.result.token)
					uni.showModal({
						content: '登录成功，token已存储',
						showCancel: false,
						success() {
							uni.navigateTo({
								url: '/pages/wxpay/wxpay'
							})
						}
					})
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: '出现错误，请稍后再试.' + err.message,
						showCancel: false
					})
				})
			},
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success(e) {
							if (e.code) {
								resolve(e.code)
							} else {
								reject(new Error('微信登录失败'))
							}
						},
						fail(e) {
							reject(new Error('微信登录失败'))
						}
					})
				})
			},
			
		}
	}
</script>

<style>
	.picWrapper{
		background-color: #ffffff;
		margin-top: 20px;
		width: 100%;
		height: 20%;
		text-align: center;
		margin-bottom: 60px;
	}
	.picMode{
		max-width: 100%;
		height: auto;
		display: block;
		margin: 0 auto;
	}
	.white{
		background-color: #ffffff;
	}
	.baoxiuText{
		display: block;
		margin-top: 20px;
		font-weight: bold;
		font-size: large;
		color: #555555;
	}
	.loginButton{
		background-color: #0FAEFF;
		font-weight: bold;
	}
	
</style>
