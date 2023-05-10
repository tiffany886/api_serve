// 这是文章分类的路由模块
const express = require('express')
const router = express.Router()
const artcate_handler = require('../router_handler/artcate')

// 导入验证规则
const expressJWT = require('@escook/express-joi')
const {add_article_schema,delete_article_schema}=require('../schema/artcate')
// 获取文章列表数据的路由
router.get('/cates', artcate_handler.getArticleCates)
// 新增文章分类的接口
router.post('/addcates', expressJWT(add_article_schema), artcate_handler.addArticleCates)
// 删除文章分类的接口定义
router.get('/deletecate',artcate_handler.deleteArticleCates)
// 讲路由对象共享出去
module.exports = router