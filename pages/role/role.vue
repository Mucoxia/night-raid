<template>
	<view class="outer">
		<div class="title">您的角色是</div>
		<div class="container">
			<div class="block" @click="setRole(0)">
				<cmd-avatar src="../../static/role/user.png" :size="80"></cmd-avatar>
				<span class='label'>我是求助者</span>
			</div>
			<hr class="style-one" />
			<div class="block" @click="setRole(1)">
				<cmd-avatar src="../../static/role/engineer.png" :size="80"></cmd-avatar>
				<span class='label'>我是维修者</span>
			</div>
		</div>
	</view>
</template>

<script>
import cmdAvatar from '@/components/cmd-avatar/cmd-avatar.vue';
import { responseCode } from '../../common/constants.js'
export default {
	data() {
		return {};
	},
	components: { cmdAvatar },
	methods: {
		setRole(role) {
			uni.showLoading({
				title: '加载中...'
			});
			uniCloud
				.callFunction({
					name: 'setRole',
					data: {
						token: uni.getStorageSync('token'),
						role: role
					}
				})
				.then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.result.status !== responseCode.success) {
						return Promise.reject(new Error(res.result.msg));
					}
					uni.showModal({
						content: '选择角色成功',
						showCancel: false
					});
					uni.setStorage({
						role:role
					})
					uni.$emit('setRole',{msg:role})
				})
				.catch(err => {
					console.log(err);
					uni.hideLoading();
					uni.showModal({
						content: '选择角色失败，' + err.message,
						showCancel: false
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.outer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
}
.title {
	padding:20px 0px;
	font-weight: bold;
	font-size: 18px;
}
.container {
	width: 100%;
	flex: 1;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-around;
	.style-one {
		width: 80%;
		border: 0;
		height: 1px;
		background-color: #e6e6e6;
	}
}
.block {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.label{
		padding-top: 10px;
	}
}
</style>
