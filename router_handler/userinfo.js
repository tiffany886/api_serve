// 导入数据库操作模块
const db = require('../db/index')
// 导入bcrypt这个包 用于处理密码，将用户密码和数据库中存储的进行比较
const bcrypt = require('bcryptjs')
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的sql语句
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`
    // 调用db.query执行SQL语句
    // 当身份验证成功了，就会再req身上挂载一个user对象，里面有用户的全部信息
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 指向sql语句成功，但是查询的结果可能为空
        if (results.length != 1) return res.cc('获取用户信息失败')

        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 定义更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows != 1) {
            return res.cc('更新用户的基本信息失败')
        }
        res.cc('更新用户信息成功', 0)
    })
}

// 定义更新用户密码的基本处理信息函数
exports.updatepwd = (req, res) => {
    // 首先查询用户是否存在
    const sql1 = `select * from ev_users where id=?`
    db.query(sql1, req.user.id, (err, results) => {
        // 执行sql语句失败
        console.log(req)
        if (err) return res.cc(err)
        if (results.length != 1) return res.cc('用户不存在！')
        console.log(req.body)
        // 判断用户输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        console.log(compareResult)
        if (!compareResult) return res.cc('旧密码错误')
        // 如果旧密码正确则修改密码
        const sql2 = `update ev_users set password=? where id=? `
        req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql2, [req.body.newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败')
            }
            res.cc('更新密码成功', 0)
        })
    })
    // 判断
    // const sql = `update`
}

// 定义更新用户头像的路由处理函数
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        return res.cc('更新头像成功', 0)
    })
}