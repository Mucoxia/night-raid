<template>
	<view class="content white">
		<view class="picWrapper">
			<image class="picMode" style="width: 100px;height:100px;" src="../../static/img/baoxiupic.png"></image>
			<text class="baoxiuText">报修管家</text>
		</view>
		<view v-if='this.showLoginButton' class="btn-row">
			<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="loginButton" type="primary" @click="loginMp" >微信用户一键登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showLoginButton: false,
				userId: '',
				password: ''
			}
		},
		onLoad() {
			this.validateToken()
		},
		methods: {
			bindGetUserInfo:function(e){
			        if (e.detail.userInfo) {
			            //用户按了允许授权按钮
			            var that = this;
			            // 获取到用户的信息了，打印到控制台上看下
			            console.log("用户的信息如下：");
			            console.log(e.detail.userInfo);
						uni.setStorageSync('userInfo', e.detail.userInfo)
			        } else {
			            //用户按了拒绝按钮
			            wx.showModal({
			                title: '警告',
			                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
			                showCancel: false,
			                confirmText: '返回授权',
			                success: function(res) {
			                    // 用户没有授权成功，不需要改变 isHide 的值
			                    if (res.confirm) {
			                        console.log('用户点击了“返回授权”');
			                    }
			                }
			            });
			        }
				},
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
					uni.hideLoading()
					this.getRoleById(uni.getStorageSync('token'))
				}).catch((err) => {
					uni.hideLoading()
					this.showLoginButton = true;
				})
				uni.getSetting({
					provider:uni.getProvider(),
					success:function(res){
						console.log('success get Setting')
						if (res.authSetting['scope.userInfo']) {
						    uni.getUserInfo({
								provider:"weixin",
						        success: function(res) {
						        // 用户已经授权过
								console.log("1111111");
								console.log(res);
								uni.setStorageSync('userInfo', res.userInfo)
								
						        }
						    });
						} else {
							console.log('没有授权')				
						}
					},
					fail:function(res){
						console.log(res)	
					}
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
					res.result.userId;
					uni.setStorageSync('token', res.result.token)
					uni.setStorageSync("openid",res.result.userInfo)
					console.log('token and openid')
					console.log(res)
					uni.showModal({
						content: '登录成功，token已存储',
						showCancel: false,
						success() {
							this.getRoleById(res.result.token)
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
								reject(new Error('微信登录失败1'))
							}
						},
						fail(e) {
							reject(new Error('微信登录失败'))
						}
					})
				})
			},
			getRoleById(TokenId){
				uniCloud.callFunction({
					name: 'getRoleById',
					data: {
						token: TokenId,
					}
				}).then((res) => {
					uni.hideLoading()
					console.log(res.result)
					if(res.result.status === "200")
					{
						uni.switchTab({
							url: '/pages/home/userHome'
						})
					}else{
						uni.navigateTo({
							url: '/pages/home/repaiHome'
						})
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: '出现错误，请稍后再试.' + err.message,
						showCancel: false
					})
				})
			}
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
		background-color: #0000fb;
		font-weight: bold;
	}
	
</style>