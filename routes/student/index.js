
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
router.get('/student/again', (req, res) => {
  const sql = `select * from student_password 
  where creat_time like '${req.query.creat_time.slice(0, 10) + "%"}' 
  and student_id 
  IN 
  (select id from student where account=?)`
  const sqlArr = [req.query.account]
  query(sql, sqlArr, (err, vals) => {
    if (err) {
      console.log(err);
      return res.send(err)
    }
    const row = JSON.parse(JSON.stringify(vals))
    res.send({
      data: row,
      status: 201
    })
  })
})
// 查询修改密码的信息
router.get('/student/password', (req, res) => {
  const arr = req.body
  const sql = `select student_password.id, account, name, password,class, major, department, phone,ID_type,ID_number,creat_time,status
    from student,student_password 
    where  DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(student_password.creat_time)
    AND student.id = student_password.student_id
	  order by time desc`
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
router.post('/student/add_message', teaMiddleWare(), (req, res) => {
  const sql1 = `select id from student where account=?`
  const sqlArr1 = [req.body.account]
  query(sql1, sqlArr1, (err, vals) => {
    if (err) {
      return console.log(err);
    } else {
      const student_id = JSON.parse(JSON.stringify(vals))[0].id;
      const sql = `INSERT INTO student_password ( id, student_id, password,operator, creat_time,status )
      VALUES ( 0, ?, ?, ?,?,-1 );`
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
      WHERE ${req.body.index} LIKE '${"%" + req.body.value + "%"}' `
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

// 查询申请当天学生的状态
router.get('/student/stu_pwd_sum', (req, res) => {
  const date = new Date()
  const year = date.getFullYear()
  var month = date.getMonth()
  if (month != 0) {
    month = month + 1
  } else {
    month = 12
  }
  var days = date.getDate()
  if (days >= 0 && days <= 9) {
    days = '0' + days
  }
  const time = year + '-' + month + '-' + days
  const sql = `
  select student.name,student.account,people_sum.creat_time,student_password.status,operator,student_password.id
  from student,people_sum,student_password
  where student_password.creat_time LIKE '${"%" + time + "%"}'
  AND student.account = people_sum.people_account 
  AND student.id = student_password.student_id 
	AND student_password.creat_time = people_sum.creat_time
  AND people_sum.service_type = 'pwd' 
  AND people_type='student'
  order by student_password.status, student_password.time desc 
  `
  query(sql, (err, vals) => {
    if (err) {
      console.log(err);
      return res.send(err)
    }
    const row = JSON.stringify(vals)
    res.send({
      status: 201,
      message: '查询成功',
      data: row
    })

  })
})

// 根据id改变申请学生的状态（未审核->审核中）
router.post('/student/edit_status1', (req, res) => {
  if (req.body.status < 1) {
    const sql = `
  update student_password 
  SET status = ${req.body.status + 1}
  WHERE id=${req.body.id}`
    query(sql, (err, vals) => {
      if (err) {
        console.log(err);
        return res.send({
          status: 402,
          data: err
        })
      }
      res.send({
        status: 201,
        message: '已确定'
      })
    })
  }
  else {
    return res.send({
      status: 201,
      message: '完成修改'
    })
  }
})

// 查询一周内的学生修改量
router.get('/student/edit_sum', (req, res) => {
  const sql = `
  SELECT creat_time, COUNT(*) 
  FROM  student_password 
  WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) < date(creat_time)   
  GROUP BY creat_time;`
  query(sql, (err, vals) => {
    if (err) {
      return res.send({
        status: 402,
        data: err
      })
    }
    res.send({
      status: 201,
      message: '查询成功',
      data: vals
    })
  })
})

// 一键修改
router.put('/student/pwd_alter',(req,res)=>{
  const sql = `UPDATE student_password SET status='1'`
  query(sql,(err,vals)=>{
    if (err) {
      return res.send({
        status:402,
        message:'修改失败',
      })
    }
    res.send({
      status:201,
      message:'修改完成',
    })
  })
})

// -----------------------------------------查询申请任务---------------------------------------------
router.get('/student/steps', (req, res) => {
  console.log(req);
  const sql = `select name, account,student_password.id,student_password.creat_time 
  from student_password,student
  where student_id =student.id 
  AND  account=? 
  order by time desc`
  const sqlArr = [req.query.account]
  query(sql, sqlArr, (err, vals) => {
      if (err) {
          console.log(err);
          return res.send(err)
      }
      res.send({
          status: 201,
          data: vals
      })
  })
})

// -----------------------------------------查看申请进度---------------------------------------------
router.post('/student/step', (req, res) => {
  const sql = `select * from student_password where id=?`
  const sqlArr = [req.body.id]
  query(sql, sqlArr, (err, vals) => {
      if (err) {
          console.log(err);
          return res.send(err)
      }
      res.send({
          status: 201,
          data: vals
      })
  })
})


module.exports = router