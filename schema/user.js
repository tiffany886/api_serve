// 用于专门给登录注册的验证规则使用
// 导入定义验证规则的包
const joi = require('joi');

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * /u 表示按unicode(utf-8)匹配（主要针对多字节比如汉字）
 * /i 表示不区分大小写（ 如果表达式里面有 a， 那么 A 也是匹配对象）
 * /s 表示将字符串视为单行来匹配
 * ref 两者相同
 * not 排除项的意思
 * concat用于合并两条验证规则
 */

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 定义id nickname email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 向外共享验证对象
exports.update_userinfo_schema = {
    // 需要对req.body数据进行验证
    body: {
        id,
        nickname,
        email
    }
}

exports.update_userpwd_schema = {
    body: {
        oldPwd: password,
        // 不能和原来的密码一致以外还要保持原来的验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 验证表单数据
const avatar = joi.string().dataUri().required()

exports.update_avatar_schema = {
    body: {
        avatar
    }
}

