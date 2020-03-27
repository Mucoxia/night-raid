<template>
	<view class="container">
		<view class="outer">
				<view class=" uni-column">
					<div class="label">
						<span class="text">地址</span>
						<span class="text">{{banner.floor}}</span>
						<!-- <span class="text">{{content.address}}</span> -->
					</div>
				</view>
				<view class=" uni-column">
					<div class="label">
						<span class="text">联系人</span>
						<span class="text">{{banner.contactName}}</span>
						<!-- <span class="text">{{content.name}}</span> -->
					</div>
				</view>
				<view class=" uni-column">
					<div class="label">
						<span class="text">手机</span>
						<span class="text">{{banner.phone}}</span>
					</div>
				</view>
				<view class=" uni-column">
					<div class="label">
						<span class="text">拨打电话</span>
						<image :fade-show="false" class="image-list3"
						 src="../../static/img/phone.png" @click="makePhoneCall(banner.phone)"></image>
					</div>
				</view>
				<view class=" uni-column">
					<div class="label">
						<span class="text">故障设备</span>
						<span class="text">{{banner.damagedObject}}</span>
						<!-- <span class="text">{{content.thing}}</span> -->
					</div>
				</view>
				<view class=" uni-column">
					<div class="label">
						<span class="text">保修时间</span>
						<span class="text">{{banner.datetime}}</span>
					</div>
				</view>
				<view class=" uni-column">
					<div class="label"><span class="text">故障描述</span></div>
				</view>
				<view class=" uni-column">
					<div class="detail">
						<div class="label" style="border-bottom: none;">
							<text name="detail" class="detailInput">{{banner.detail}}</text>
							<!-- <text name="detail" class="detailInput">{{content.detail}}</text> -->
						</div>
						<view v-for="(item) in banner.img_url" :key="item.id">
							<img class="img" :src="item" @click="clickImg(item)" />
						</view>
						
					</div>
				</view>
				<view class="uni-btn-v"><button class="submit_btn" @click="clickButton()">提交</button></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: {},
				handle: '',
			}
		},
		onLoad(event) {
			try {
				this.banner = JSON.parse(decodeURIComponent(event.query));
			} catch (error) {
				this.banner = JSON.parse(event.query);
			}
		},
		methods: {
			clickImg(url) {
				uni.previewImage({
				            urls: [url],
				            longPressActions: {
				                itemList: ['发送给朋友', '保存图片', '收藏'],
				                success: function(data) {
									 console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				                },
				                fail: function(err) {
				                    console.log(err.errMsg);
				                }
				            }
				})
			},
			clickButton() {
				alert("按了")
				console.log("按了")
			},
			makePhoneCall(phoneNumber){
				
				uni.makePhoneCall({
				    phoneNumber: phoneNumber //仅为示例
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #e6e6e6;
		width: 100%;
		heihgt: auto;
		flex-direction: column;
		align-items: center;
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		min-height: 180px;
		max-height: auto;

		.img {
			width: 200px;
			height: auto;
			padding-left: 30px;
			padding-top: 30px;
			padding-bottom: 10px;
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
			padding: 0 20px;
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
	
	.image-list3 {
	    width: 50upx;
	    height: 50upx;
		padding-right: 20px
	}
</style>
