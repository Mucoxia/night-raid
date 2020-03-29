<template>
	<view class="container">
		<div class="top">
			<cmd-avatar :src="url" :size="50"></cmd-avatar>
			<div class="name">{{ name }}</div>
		</div>
		<div class="card">
			<navigator url="redirect/redirect?title=redirect" open-type="redirect" hover-class="other-navigator-hover">
				<div class="sections">
					<image class="img" src="../../static/my/score.png" />
					<span class="text">我的积分</span>
					<image class="rightimg" src="../../static/home/right_arrow.png" />
				</div>
			</navigator>
			<navigator url="/pages/role/role?from=mypage" open-type="navigate" animation-type="slide-in-left" hover-class="other-navigator-hover">
				<div class="sections">
					<image class="img" src="../../static/my/change_role.png" />
					<span class="text">更换角色</span>
					<image class="rightimg" src="../../static/home/right_arrow.png" />
				</div>
			</navigator>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: uni.getStorageSync('userInfo').nickName,
			url: uni.getStorageSync('userInfo').avatarUrl
		};
	},
	methods: {},
	mounted() {}
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	display: flex;
	background-color: #e6e6e6;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}
.top {
	display: flex;
	align-items: center;
	width: 100%;
	height: 20%;
	padding-left: 10px;
	background-color: #ffffff;
}
.card {
	border-radius: 5px;
	margin-top: 10px;
	width: 96%;
	background-color: #fff;
	.sections {
		display: flex;
		align-items: center;
		height: 40px;
		.img {
			padding-left: 10px;
			width: 20px;
			height: 20px;
		}
		.text {
			font-size: 13px;
			padding-left: 10px;
			width: 80%;
		}
		.rightimg {
			width: 20px;
			height: 20px;
		}
	}
}
.my-image {
	border-radius: 50% 50%;
	height: 30px;
	width: 30px;
}

.name {
	font-size: 20px;
	padding-left: 10px;
	padding-bottom: 20px;
}

.history {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.history:active {
	background: #e6e6e6;
}
</style>
