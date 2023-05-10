// 验证新增文章分类数据
const name = joi.string().required()
const alias = joi.string().alphanum().required()

exports.add_article_schema = {
    body: {
        name,
        alias
    }
}

// 验证删除文章分类的规则
const id = joi.number().integer().min(1).required()
exports.delete_article_schema = {
    // body: {
        // id
    // }
}