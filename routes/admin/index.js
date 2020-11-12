const express = require('express')
const query = require('../../dbConfig')
const router = express.Router()

// 管理员登录
router.post('/admin/login', (req, res) => {
    const sql = `select * from wx_admin where name=? and password=?`
    const sqlArr = [req.body.name, req.body.password]
    query(sql, sqlArr, (err, vals) => {
      if (err) {
        return console.log(err);
      }
      const row = vals
      if (row.length != 0) {
        return res.send({
          message: 'OK',
          status: 201
        })
      }
      res.send({ status: 404 })
    })
  })

//   注册
router.post('/admin/register', (req, res) => {
    const sql = `select * from wx_admin where name=? and password=?`
    const sqlArr = [req.body.name, req.body.password]
    query(sql, sqlArr, (err, vals) => {
      if (err) {
        return console.log(err);
      }
      const row = vals
      if (row.length != 0) {
        return res.send({
          message: 'OK',
          status: 201
        })
      }
      res.send({ status: 404 })
    })
  })

  module.exports = router