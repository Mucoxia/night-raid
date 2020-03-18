<template>
	<view>
		<view v-if='user' class="outer">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">地址</span>
						<input name='address' class="input" placeholder="请输入维修地址" placeholder-class='placeholder' />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">联系人</span>
						<input class="input" name='name' placeholder="请输入联系人姓名" placeholder-class='placeholder' />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">手机</span>
						<input class="input" name='phone' placeholder="请输入手机号码" placeholder-class='placeholder' />
					</div>
				</view>
				<view class="uni-form-item uni-column">
					<div class="label">
						<span class="text">故障设备</span>
						<picker name='device' class="input" @change="bindPickerChange" :value="index" :range="array">
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
							<input name='detail' class="input" placeholder="请输入详细描述" placeholder-class='placeholder' />
						</div>
						<span class="numberText">0/300</span>
						<img class="img" src="../../static/home/upload_picture.png" />
					</div>
				</view>
				<view class="uni-btn-v"><button form-type="submit" class="submit_btn">提交</button></view>
			</form>
		</view>
		<view v-else>
			<template>
				<mescroll-body class = "mescrollRef" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<good-list :list="goods"></good-list>
				</mescroll-body>
			</template>
		</view>
	</view>
</template>
<script>
	import {apiOrders} from '../../api/requestOrder.js'
	export default {
		components: {
		},
		data() {
			return {
				goods: [], // 数据列表
				isGoodsEdit: false, // 是否加载编辑后的数据
				title: 'picker',
				array: ['电脑', '软件', '系统'],
				index: 0,
				user: false
			};
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				apiOrders(page.num, page.size, this.isGoodsEdit).then(curPageData => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					this.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods = this.goods.concat(curPageData); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			formSubmit: function(e) {
				var formdata = e.detail.value;
				formdata.device = this.array[formdata.device];
				uni.showLoading({
					title: '创建报修单中...'
				})
				const data = JSON.stringify(formdata);
				uniCloud.callFunction({
					name: 'order',
					data: {
						openId,
						token,
						data
					},
				}).then((res) => {
					console.log(res);
					uni.hideLoading()
					if (res.result.status !== 0) {
						return Promise.reject(new Error(res.result.msg))
					}
					uni.setStorageSync('token', res.result.token)
					uni.showModal({
						content: '创建报修单成功',
						showCancel: false
					})
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: '创建报修单失败，' + err.message,
						showCancel: false
					})
				})

			},

			bindPickerChange(e) {
				this.index = e.target.value;
			}
		}
	};
</script>

<style lang="scss">
	.detail {
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.img {
			width: 30px;
			height: 30px;
			padding-left: 30px;
			padding-top: 30px;
		}

		.numberText {
			position: absolute;
			right: 10px;
			margin-top: 10px;
		}
	}

	.label {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #CCCCCC;

		.uni-input {
			text-align: right;
			padding-right: 40px;
		}

		.text {
			padding: 0 20px;
			font-size: 14px;
		}

		.img {
			position: absolute;
			width: 20px;
			height: 20px;
			right: 10px
		}

		.input {
			flex: 1;
		}

		.placeholder {
			font-size: 12px;
		}
	}

	.submit_btn {
		width: 100%;
		position: absolute;
		bottom: 0;
		background-color: #1296db;
		color: white;
	}

	.outer {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>

<style>
	/*说明*/
	.mescroll-upwarp{
		margin: 0 auto;
		width: 100%;
	}
	.notice-warp {
		font-size: 26upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}

	.notice-warp .notice {
		color: #555;
	}

	.notice-warp .btn-change {
		display: inline-block;
		margin-top: 28upx;
		padding: 6upx 16upx;
		border: 1upx solid #FF6990;
		border-radius: 40upx;
		color: #FF6990;
	}

	.notice-warp .btn-change:active {
		opacity: .5;
	}
</style>
