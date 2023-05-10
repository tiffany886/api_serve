const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象，由于得到的是一个对象，所以需要解构赋值
const {
    reg_login_schema
} = require('../schema/user')

//在注册新用户的时候调用验证数据的中间件，
//并把验证规则当成参数传入方法中  expressJoi(reg_login_schema)

// 注册新用户,同时添加验证数据的中间件
router.post('/reguster', expressJoi(reg_login_schema), user_handler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.Login)

module.exports = router