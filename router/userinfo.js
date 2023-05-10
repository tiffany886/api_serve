const express = require('express')
const router = express.Router()
// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入验证数据的验证规则
// 导入修改密码的验证规则
// 导入验证头像的验证规则
const {
    update_userinfo_schema,
    update_userpwd_schema,
    update_avatar_schema
} = require('../schema/user')

// 挂载路由

// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)

// 定义更新用户基本信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 定义重置密码的路由
router.post('/updatapwd', expressJoi(update_userpwd_schema), userinfo_handler.updatepwd)

// 定义更新用户头像的路由
router.post('/updata/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
module.exports = router