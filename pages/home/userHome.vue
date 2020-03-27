<template>
	<view class="container">
		<view class='upload-picture-loading' v-if='showPictureLoading'>
			<cmd-circle type="circle" :percent="uploadPicturePercent" :width='40' font-color="#000000" :font-size="10"></cmd-circle>
		</view>
		<view v-if="user" class="outer">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">地址</span>
						<picker name="address" class="input" @change="bindAddressPickerChange" :value="addressIndex" :range="addressArray">
							<view class="uni-input">{{ addressArray[addressIndex] }}</view>
						</picker>
						<img class="img" src="../../static/home/right_arrow.png" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">联系人</span>
						<input class="input" name="name" placeholder="请输入联系人姓名" placeholder-class="placeholder" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">手机</span>
						<input class="input" name="phone" placeholder="请输入手机号码" placeholder-class="placeholder" />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">故障设备</span>
						<picker name="device" class="input" @change="bindDevicePickerChange" :value="deviceIndex" :range="deviceArray">
							<view class="uni-input">{{ deviceArray[deviceIndex] }}</view>
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
							<input name="detail" class="detailInput" placeholder="请输入详细描述" placeholder-class="placeholder" />
						</div>
						<img class="img" src="../../static/home/upload_picture.png" @click="uploadPicture" />
						<view class='detail-img-wrapper'>
							<view class='detail-img-outer' v-for="(url,index) in pictureUrls" :key='index'>
								<img class='detail-img' :src='url' />
								<img class='detail-delete-img' src='../../static/home/delete.png' @click='handleDelete(index)' />
							</view>

						</view>
					</div>
				</view>
				<view class="uni-btn-v"><button form-type="submit" class="submit_btn">提交</button></view>
			</form>
		</view>
	</view>
</template>
<script>
	import detail from '../detail/detail.vue';
	import cmdCircle from "@/components/cmd-circle/cmd-circle.vue"
	import {
		responseCode
	} from "../../common/constants.js"


	export default {
		components: {
			detail,
			cmdCircle
		},
		onLoad() {
			if (!this.user) {
				console.log("jump")
				uni.navigateTo({
					url: '/pages/news/index'
				});
			}
		},
		data() {
			return {
				deviceArray: ['电脑', '软件', '系统'],
				addressArray: ['4楼', '5楼', '6楼', '7楼', '8楼', '12楼', '13楼'],
				deviceIndex: 0,
				addressIndex: 0,
				user: true,
				uploadPicturePercent: 40,
				pictureUrls: [],
				showPictureLoading: false,
			};
		},
		methods: {
			handleDelete(index) {
				console.log(index)
				this.pictureUrls.splice(index, 1)
			},
			formSubmit: function(e) {
				var formdata = e.detail.value;
				formdata.device = this.deviceArray[formdata.device];
				formdata.picture = this.pictureUrls;
				formdata.address = this.addressArray[formdata.address];
				console.log(formdata)
				uni.showLoading({
					title: '创建报修单中...'
				});
				const data = JSON.stringify(formdata);
				uniCloud
					.callFunction({
						name: 'createOrder',
						data: {
							token: uni.getStorageSync('token'),
							data: data
						}
					})
					.then(res => {
						console.log(res);
						uni.hideLoading();
						if (res.result.status !== responseCode.success) {
							return Promise.reject(new Error(res.result.msg));
						}
						uni.showModal({
							content: '创建报修单成功',
							showCancel: false
						});
					})
					.catch(err => {
						console.log(err);
						uni.hideLoading();
						uni.showModal({
							content: '创建报修单失败，' + err.message,
							showCancel: false
						});
					});
			},

			bindDevicePickerChange(e) {
				this.deviceIndex = e.target.value;
			},
			bindAddressPickerChange(e) {
				this.addressIndex = e.target.value;
			},
			onUploadProgress(progressEvent) {
				console.log(progressEvent);
				var percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
			},
			uploadPicture() {
				uni.authorize({
					scope: 'scope.camera', //获取拍摄权限
					success: () => {
						uni.chooseImage({
							count: 1,
							success: (res) => {
								this.showPictureLoading=true
								if (res.tempFilePaths.length > 0) {
									let filePath = res.tempFilePaths[0]
									uniCloud.uploadFile({
										filePath: filePath,
										onUploadProgress: (progressEvent) => {
											console.log(progressEvent);
											var percentCompleted = Math.round(
												(progressEvent.loaded * 100) / progressEvent.total
											);
											this.uploadPicturePercent = percentCompleted

										},
										success: (res) => {
											this.pictureUrls.push(res.fileID)
											console.log(this.pictureUrls)
										},
										fail: () => {
											uni.showModal({
												content: '请求云函数发生错误，' + err.message,
												showCancel: false
											})
										},
										complete: ()=> {
											this.showPictureLoading=false
										}
									});

								}

							}
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.detail-delete-img {
		position: absolute;
		height: 18px;
		width: 18px;
		right: 12px;
		top: 12px;
	}

	.detail-img-outer {
		position: relative;
		padding: 20px 20px;
	}

	.detail-img-wrapper {
		display: flex;
		align-items: center;

		.detail-img {
			width: 60px;
			height: 60px;
		}
	}

	.upload-picture-loading {
		position: absolute;
		left: 0;
		top: 0;
		margin: auto;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.container {
		background-color: #e6e6e6;
		width: 100%;
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 250px;

		.img {
			width: 30px;
			height: 30px;
			padding-left: 30px;
			padding-top: 30px;
		}
	}

	.label {
		padding-right: 10px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.detailInput {
			flex: 1;
			font-size: 14px;
		}

		.uni-input {
			text-align: right;
			padding-right: 20px;
		}

		.text {
			padding: 0 20px;
			font-size: 14px;
		}

		.img {
			position: absolute;
			width: 20px;
			height: 20px;
			right: 10px;
		}

		.input {
			text-align: right;
			flex: 1;
			font-size: 14px;
		}

		.placeholder {
			font-size: 12px;
		}
	}

	.submit_btn {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #1296db;
		color: white;
	}

	.outer {
		border-radius: 5px;
		background-color: #fff;
		margin: 10px 10px 0px 10px;
	}
</style>
