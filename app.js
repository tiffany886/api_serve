// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 导入验证数据的中间件（下面获取异常信息的时候用到）
const joi = require('joi');

//配置解析表单数据的中间件，注意：这个中间件，
//只能解析 application / x - www - form - urlencoded 格式的表单数据
app.use(express.urlencoded({
    extended: false
}))

// 一定要在路由之前进行函数的封装；
app.use(function (req, res, next) {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            // 判断是否为错误对象，如果是对象就返回message，不是对象直接返回该字符串即可
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

// 注册全局中间件
// 使用unless（{path: [/^\/api/]}）指定哪些接口不需要进行Token的身份认证
app.use(expressJWT({
    secret: config.jwtSecretKsy
}).unless({
    path: [/^\/api/]
}))

// 导入并注册路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并注册文章的路由模块
const artcateRouter = require('./router/artcate')
app.use('/my/article', artcateRouter)

/**
 * 该方法用于封装res.send中返回的失败信息
 * 将函数绑定在req上
 * 函数参数：
 *      1：err表示错误对象或者描述错误的字符串
 *      2：status表示的是返回的状态，默认状态就是失败
 */
// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)

    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    // 未知的错误
    res.cc(err)
})

app.listen(8088, function () {
    console.log('api server running at http://127.0.0.1:8088')
})