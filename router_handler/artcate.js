// 导入数据库操作模块
const db = require('../db/index')
// 获取文章列表
exports.getArticleCates = (req, res) => {
    // 传入参数
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        // if (results.length <= 0) return res.cc('列表为空')
        res.send({
            state: 0,
            message: '获取文章分类列表成功',
            data: results
        })
    })
    // res.send('242423')
}
// 新增文章分类
exports.addArticleCates = (req, res) => {
    // 查询分类别名和分类名称是否被占用
    const sql1 = `select * from ev_article_cate where name=? or alias=?`;
    db.query(sql1, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 2) {
            return res.cc('用户名和别名分别被占用')
        }
        if (results.length == 1) {
            if(results[0].name == req.body.name&&results[0].alias==req.body.alias) return res.cc('用户名和别名同时被占用')
        }
        if (results.length == 1) {
            if (results[0].name == req.body.name) return res.cc('用户名被占用');
            if(results[0].alias==req.body.alias) return res.cc('用户别名被占用')
        }
        const sql2 = `insert into ev_article_cate set ?`;
        console.log(req.body.alias)
        // 插入数据
        db.query(sql2, { name: req.body.name, alias: req.body.alias }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('插入失败')
            }
            return res.cc('插入成功', 0)
        })
    })
}

// 根据id删除文章分类
exports.deleteArticleCates=(req, res)=> {
    res.send('deleok')
}