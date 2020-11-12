
const express = require('express')
const teaMiddleWare = require('../../middleWare/addMiddleWare')
const query = require('../../dbConfig')
const router = express.Router()

// 查询所有学生基本信息
router.get('/student/message', (req, res) => {
  const sql = `select * from student`
  query(sql, (err, vals) => {
    if (err) {
      console.log(err)
      return res.send()
    }
    const row = JSON.stringify(vals)
    res.send({
      message: '获取成功',
      status: 201,
      data: row
    })
  })
})

// 查询学生一天内是否已经申请过
router.get('/student/again',(req,res)=>{
  const sql = `select * from student_password 
  where creat_time like '${req.query.creat_time.slice(0,10)+"%"}' and student_id IN 
  (select id from student where account=?)`
  const sqlArr = [req.query.account]
  query(sql,sqlArr,(err,vals)=>{
    if (err) {
      console.log(err);
      return res.send(err)
    }
    const row = JSON.parse(JSON.stringify(vals))
    res.send({
      data:row,
      status:201
    })
  })
})

// 查询修改密码的信息
router.get('/student/password', (req, res) => {
  const arr = req.body
  const sql = `select student_password.id, account, name, password,class, major, department, phone,ID_type,ID_number,creat_time
    from student,student_password 
    where student.id = student_password.student_id
	order by creat_time desc`
  const sqlArr = [arr.account, arr.password_type, arr.section, arr.creat_time]
  query(sql, sqlArr, (err, vals, fields) => {
    if (err) {
      console.log(err);
      return res.send(err)
    }
    const row = JSON.stringify(vals)
    res.send({
      message: '提交成功',
      data: row,
      status: 201
    })
  })
})

// 添加学生信息
router.post('/student/add_message',teaMiddleWare(), (req, res) => {
  const sql1 = `select id from student where account=?`
  const sqlArr1 = [req.body.account]
  query(sql1, sqlArr1, (err, vals) => {
    if (err) {
      return console.log(err);
    } else {
      const student_id = JSON.parse(JSON.stringify(vals))[0].id;
      const sql = `INSERT INTO student_password ( id, student_id, password,operator, creat_time )
      VALUES ( 0, ?, ?, ?,? );`
      const sqlArr = [student_id, req.body.password, req.body.operator, req.body.creat_time]
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
})

// 根据id删除一行数据
router.delete('/student/del_pwd/:id', (req, res) => {
  const sql = `Delete from student_password where id = ${req.params.id}`
  query(sql, (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send({ status: 201 })
  })
})

// 根据id批量删除数据
router.post('/student/del_pwd', (req, res) => {
  const sql = ` DELETE  from student_password where id in (${req.body.join(',')})`

  query(sql, (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send({ status: 201 })
  })
})

// 学生修改密码的搜索功能
router.post('/student/find_pwd', (req, res) => {
  const sql = `select student_password.id, account, name, password,class, major, department, phone,ID_type,ID_number,creat_time
    from student, student_password 
    WHERE ${req.body.index} LIKE '${"%" + req.body.value + "%"}' AND student.id=student_password.student_id
    order by creat_time desc`
  const value = "%" + req.body.value + "%"
  const sqlArr = [value]
  query(sql, (err, vals) => {
    if (err) {
      console.log(err);
      return console.log(err);
    }
    const row = JSON.stringify(vals)
    res.send({
      status: 201,
      data: row
    })
  })
})

  // 搜索学生基本信息
  router.post('/student/find_msg', (req, res) => {
    const sql = `select *
      from student 
      WHERE ${req.body.index} LIKE '${"%"+req.body.value+"%"}' `
    const value = "%" + req.body.value + "%"
    const sqlArr = [value]
    query(sql, (err, vals) => {
      if (err) {
        console.log(err);
        return console.log(err);
      }
      const row = JSON.stringify(vals)
      res.send({
        status:201,
        data:row
      })
    })
})

  module.exports = router