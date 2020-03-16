<template>
	<view class="outer">
		<div class="title">请选择您的角色</div>
		<div class="container">
			<div class="block" @click="setRole(0)">
				<cmd-avatar src="../../static/help.png" :size="100"></cmd-avatar>
				<span>求助者</span>
			</div>
			<div class="block"  @click="setRole(1)">
				<cmd-avatar src="../../static/repair.png" :size="100"></cmd-avatar>
				<span>维修者</span>
			</div>
		</div>
	</view>
</template>

<script>
import cmdAvatar from '@/components/cmd-avatar/cmd-avatar.vue';
export default {
	data() {
		return {};
	},
	components: { cmdAvatar },
	methods: {
		setRole(role){
			uni.showLoading({
				title: '加载中...'
			});
			uniCloud.callFunction({
				name: 'setRole',
				data: {
					token: uni.getStorageSync('token'),
					role:role,
				},
			}).then((res) => {
				console.log(res);
				uni.hideLoading()
				if (res.result.status !== 0) {
					return Promise.reject(new Error(res.result.msg))
				}
				uni.showModal({
					content: '选择角色成功',
					showCancel: false
				})
			}).catch((err) => {
				console.log(err);
				uni.hideLoading()
				uni.showModal({
					content: '选择角色失败，' + err.message,
					showCancel: false
				})
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.outer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: absolute;
	width: 100%;
	height: 100%;
}
.title {
	padding-bottom: 20px;
}
.container {
	display: flex;
	align-items: center;
	justify-content: space-around;
	.block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding:0px 30px
	}
}
</style>
