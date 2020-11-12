const express = require('express')
const query = require('../../dbConfig')
const router = express.Router()

// 根据id删除信息
router.delete('/del_message?id&table', (req, res) => {
  console.log(req);
    const sql = `Delete from wx_student where id = ${req.params.id}`
    query(sql, (err, data) => {
      if (err) {
        return console.log(err);
      }
      res.send({ status: 201 })
    })
  })
  
  // 根据id批量删除数据
  router.post('/del_messagem', (req, res) => {
    const sql = ` DELETE  from wx_student where id in (?)`
    const sqlArr = req.body.join(',')
    query(sql, sqlArr, (err, data) => {
      if (err) {
        return console.log(err);
      }
      res.send({ status: 201 })
    })
  })
  
  // 搜索
  router.post('/search', (req, res) => {
    const sql = `SELECT * from wx_student  WHERE ${req.body.index} LIKE ?`
    const value = "%" + req.body.value + "%"
    const sqlArr = [value]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return res.send(err)
      }
      const row = JSON.stringify(vals)
      res.send({
        message: row,
        status: 201
      })
    })
  })


  // 学生/教师登录
router.post('/login', (req, res) => {
  const user = req.query.user
  if (user == 'student') {
    const sql = `select * from student where account = ? and name = ?`
    const sqlArr = [req.body.account, req.body.name]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return res.status(400).send(err)
      } else if (JSON.stringify(vals).length <= 2) {
        return res.send({
          message: '用户不存在',
          status: 406
        })
      }
      res.send({
        // message: '登录成功',
        status: 201
      })
    })
  } else if (user == 'teacher') {
    const sql = `select * from teacher where account = ? and name = ?`
    const sqlArr = [req.body.account, req.body.name]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return res.status(400).send(err)
      } else if (JSON.stringify(vals).length <= 2) {
        return res.send({
          message: '用户不存在',
          status: 406
        })
      }
      res.send({
        status: 201
      })
    })
  }
})

// 教师注册
router.post('/register',(req,res)=>{
  const sql = `INSERT INTO teacher ( id, name, account, phone, ID_type, ID_number, department, creat_time )
  VALUES ( 0, ?, ?, ?, ?, ?, ?,? )`
  const arr = req.body
  const sqlArr = [arr.name,arr.account,arr.phone,arr.ID_type,arr.ID_number,arr.department,arr.creat_time]
  query(sql,sqlArr,(err,vals,fields)=>{
    if(err){
      return res.status(400).send(err)
    }
    res.send({
      message:'注册成功',
      status:201
    })
  })
})

// 根据学号/教工号查询学生、老师信息
router.get('/select_message', (req, res) => {
  const message = req.query
  const sql = `select * from ${message.user} where account = ?`
  const sqlArr = [message.account]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return console.log(err);
      }
      const row = JSON.stringify(vals)
      res.send({
        message:'获取数据成功',
        data: row,
        status: 201
      })
    })
})

// 更新学生/老师基本信息
router.put('/update_message/:id', (req, res) => {
  const dm = req.body.department_major.split('-')
  if (req.params.id == 1) {
    let sql = `update student set sex=?,age=?, phone=?, ID_type=?, ID_number=?, department=?, major=?, class=? where account = ? and name = ? `
    let sqlArr = [req.body.sex, req.body.age, req.body.phone, req.body.ID_type, req.body.ID_number, dm[0], dm[1], req.body.class, req.body.account, req.body.name]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return console.log(err);
      }
      res.send({
        status: 201
      })
    })
  } else {
    let sql = `update teacher set account = ?, password=?, name=?, phone=?, ID_type=?, ID_number=?, department=?, major=?, class=? where id = ? `
    let sqlArr = [req.body.account, req.body.password, req.body.name, req.body.phone, req.body.ID_type, req.body.ID_number, dm[0], dm[1], req.body.class, req.body.id]
    query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        return console.log(err);
      }
      res.send({
        status: 201
      })
    })
  }
})


  module.exports = router