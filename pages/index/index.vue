<template>
	<view class="container">
		<view class="form">
			<input type="text" value="" placeholder="用户ID" v-model="userId" />
			<input type="text" value="" placeholder="密码" password="true" v-model="password" />
			<button type="primary" @click="signUp">注册</button>
			<button type="primary" @click="signIn">登录</button>
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary" @click="loginMp">微信登录</button>
			<!-- #endif -->
			<button type="primary" @click="validateToken">token验证</button>
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
			signUp() {
				const {
					userId,
					password
				} = this
				if (userId.length < 6 || password.length < 6) {
					uni.showModal({
						content: '用户名密码长度均不能小于6',
						showCancel: false
					})
					return
				}
				uni.showLoading({
					title: '注册中...'
				})
				uniCloud.callFunction({
					name: 'signUp',
					data: {
						userId,
						password
					},
				}).then((res) => {
					console.log(res);
					uni.hideLoading()
					if (res.result.status !== 0) {
						return Promise.reject(new Error(res.result.msg))
					}
					uni.setStorageSync('token', res.result.token)
					uni.showModal({
						content: '注册成功，token已存储',
						showCancel: false
					})
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: '注册失败，' + err.message,
						showCancel: false
					})
				})
			},
			signIn() {
				const {
					userId,
					password
				} = this
				if (userId.length < 6 || password.length < 6) {
					uni.showModal({
						content: '用户名密码长度均不能小于6',
						showCancel: false
					})
					return
				}
				uni.showLoading({
					title: '登录中...'
				})
				uniCloud.callFunction({
					name: 'signIn',
					data: {
						userId,
						password
					},
				}).then((res) => {
					console.log(res);
					uni.hideLoading()
					if (res.result.status !== 0) {
						return Promise.reject(new Error(res.result.msg))
					}
					uni.setStorageSync('token', res.result.token)
					uni.showModal({
						content: '登录成功，token已存储',
						showCancel: false
					})
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: '登录失败，' + err.message,
						showCancel: false
					})
				})
			},
			// #ifdef MP-WEIXIN
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
			// #endif
			validateToken() {
				uni.showLoading({
					title: '加载中...'
				});
				uniCloud.callFunction({
					name: 'validateToken',
					data: {
						token: uni.getStorageSync('token') // token最好不要每次从storage内取，本示例为了简化演示代码才这么写
					}
				}).then((res) => {
					console.log(res);
					uni.hideLoading()
					uni.showModal({
						content: res.result.msg,
						showCancel: false
					})
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: '请求云函数发生错误，' + err.message,
						showCancel: false
					})
				})
			},
		}
	}
</script>

<style>

</style>
