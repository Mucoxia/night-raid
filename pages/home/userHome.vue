<template>
	<view>
		<view>
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">地址</span>
						<input class="input" placeholder="请输入维修地址" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">联系人</span>
						<input class="input" placeholder="请输入联系人姓名" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">手机</span>
						<input class="input" placeholder="请输入手机号码" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">故障设备</span>
						<picker class="input" @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
						<img class="img" src="../../static/home/right_arrow.png" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label"><span class="text">故障描述</span></div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="detail">
						<div class="label" style="border-bottom: none;">
						<span class="text">1.</span>
						<input class="input" placeholder="请输入详细描述" />
						</div>
					<span class="text">0/300</span>
					<img class="img" src="../../static/home/upload_picture.png" />
					</div>
				</view>
				<view class="uni-btn-v"><button form-type="submit" class="submit_btn">提交</button></view>
			</form>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			title: 'picker',
			array: ['电脑', '软件'],
			index: 0
		};
	},
	methods: {
		formSubmit: function(e) {
			console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
			var formdata = e.detail.value;
			uni.showModal({
				content: '表单数据内容：' + JSON.stringify(formdata),
				showCancel: false
			});
		},
		formReset: function(e) {
			console.log('清空数据');
		},
		bindPickerChange(e) {
			this.index = e.target.value;
		}
	}
};
</script>

<style lang="scss">
	.detail{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.text{
		}
	}
.label {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid gray;
	.text {
		padding: 0 20px;
		font-size: 18px;
	}
	.img {
		width: 20px;
		height: 20px;
		padding-right: 10px;
	}
	.input {
		flex: 1;
	}
}
.submit_btn {
	width: 100%;
	position: absolute;
	bottom: 0;
	background-color: #1296db;
	color: white;
}
</style>
