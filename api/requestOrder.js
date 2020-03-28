/*
本地模拟接口请求, 仅demo演示用.
实际项目以您服务器接口返回的数据为准,无需本地处理分页.
请参考官方写法: http://www.mescroll.com/uni.html?v=20200210#tagUpCallback
* */


// 获取商品列表数据
export function apiOrders(pageNum, pageSize) {

	return new Promise((resolute, reject) => {
		uniCloud.callFunction({
			name: 'getOrder',
			data: {
				pageNum,
				pageSize
			}
		}).then((res) => {
			resolute(res);
			console.log(res)
		}).catch((err) => {
			reject(err);
			uni.hideLoading()
			uni.showModal({
				content: '请求云函数发生错误，' + err.message,
				showCancel: false
			})
		})
	})
}

// 搜索商品
// export function apiSearch(pageNum, pageSize, keyword) {
// 	return new Promise((resolute, reject)=>{
// 		//延时一秒,模拟联网
// 		setTimeout(()=> {
// 			try{
// 				// 模拟搜索
// 				let list = []
// 				if (!keyword || keyword == "全部") {
// 					// 模拟搜索全部商品
// 					for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
// 						if (i === goods.length) break
// 						list.push(goods[i])
// 					}
// 				} else{
// 					// 模拟关键词搜索
// 					if(keyword=="母婴") keyword="婴"; // 为这个关键词展示多几条数据
// 					for (let i = 0; i < goods.length; i++) {
// 						if (goods[i].pdName.indexOf(keyword) !== -1) {
// 							list.push(goods[i])
// 						}
// 					}
// 				}
// 				//模拟接口请求成功
// 				console.log("page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length+", keyword="+keyword);
// 				resolute(list);
// 			} catch (e) {
// 				//模拟接口请求失败
// 				reject(e);
// 			}
// 		},1000)
// 	})
// }
