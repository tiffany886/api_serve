// 导入数据库操作模块
const db = require('../db/index')
// 导入bcrypt这个包 用于处理密码，将用户密码和数据库中存储的进行比较
const bcrypt = require('bcryptjs')
// 导入生成Token的包--用户生成加密的token返回给用户
const jwt = require('jsonwebtoken')
// 导入全局的配置文件 （包含token密钥）
const config = require('../config')
/**
 * 注册新用户的处理函数
 *  1.判断数据是否合法（是否为空）
 *  2.判断用户名是否重复（调用数据库）
 */
exports.regUser = (req, res) => {
    const userinfo = req.body
    console.log(userinfo);
    // 对表单的数据进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //     res.send({
    //         status: 1,
    //         message: '用户名或密码为空'
    //     })
    // }

    // 检查用户名是否被占用，用到数据库查询
    const sqlStr = 'select * from ev_users where username=?;'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        // console.log(results.length)
        // 用户名被占用则不能使用改用户名
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用，请更换其他用户名'
            // })
            return res.cc("用户名被占用，请更换其他用户名")
        }
        // 密码加密
        // 调用bcrypt.hashSync()对密码进行加密
        // console.log(userinfo);
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo);

        // 插入新用户
        const sql = 'insert into ev_users set ?';
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                // return res.send({
                //     status: 1,
                //     msg: '插入不成功，注册用户失败'
                // })
                return res.cc('插入不成功，注册用户失败')
            }
            // res.send({
            //     status: 0,
            //     msg: '插入成功'
            // })
            res.cc('插入成功', 1)


        })
    })
}
// 登录
exports.Login = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        if (results.length != 1) {
            return res.cc("不存在该用户，登录失败")
        }
        // 用户输入的密码进行加密得到的密码为tmp
        if (!bcrypt.compareSync(userinfo.password, results[0].password)) {
            return res.cc("密码错误")
        }
        // 用...展开式将对象展开，后面的两个参数如果展开式中存在则会对其进行覆盖
        const user = {
            ...results[0],
            password: '',
            user_pic: ''
        }
        console.log(user)
        // 对用户信息进行加密，用的是token的sign方法
        const tokenStr = jwt.sign(user, config.jwtSecretKsy, {
            expiresIn: config.expiresIn
        })
        // console.log(tokenStr)
        res.send({
            status: 0,
            mseeage: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}