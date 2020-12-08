const express = require('express')

const router = express.Router()

// 申请服务通知管理员
router.get('/email/admin', (req, res) => {
    //引入模块 nodemailer
    const nodemailer = require('nodemailer')
    const config = {
        // 163邮箱 为smtp.163.com
        host: 'smtp.qq.com',//这是qq邮箱
        //端口
        port: 465,
        auth: {
            // 发件人邮箱账号
            user: '2285955616@qq.com',
            //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
            pass: 'skjrfopxmenseaeg'
        }
    }
    const transporter = nodemailer.createTransport(config)

    const mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: '彼岸、忆流年<2285955616@qq.com>',
        // 主题
        subject: '服务申请通知',
        // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
        to: `31110129@ayit.edu.cn`,
        // 内容
        text: ``,
        //这里可以添加html标签
        html: `<p>邮件内容 ：您有一个申请待处理，请注意处理</p>`
    }

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        transporter.close()
        console.log('mail sent:', info.response)
        res.send({
            status:201,
            message:'发送成功',
          })
    })
    
})

// 修改密码完成通知用户
router.post('/email/user', (req, res) => {
    //引入模块 nodemailer
    const nodemailer = require('nodemailer')
    const config = {
        // 163邮箱 为smtp.163.com
        host: 'smtp.qq.com',//这是qq邮箱
        //端口
        port: 465,
        auth: {
            // 发件人邮箱账号
            user: '2285955616@qq.com',
            //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
            pass: 'skjrfopxmenseaeg'
        }
    }
    const transporter = nodemailer.createTransport(config)

    const mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: '彼岸、忆流年<2285955616@qq.com>',
        // 主题
        subject: '服务申请通知',
        // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
        to: `${req.body.account}@ayit.edu.cn`,
        // 内容
        text: ``,
        //这里可以添加html标签
        html: `<p>邮件内容 ：您的申请已通过，请注意查看</p>`
    }

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        transporter.close()
        console.log('mail sent:', info.response)
        res.send({
            status:201,
            message:'发送成功',
          })
    })
    
})

module.exports = router