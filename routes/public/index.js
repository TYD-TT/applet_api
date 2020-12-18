const express = require('express')
const query = require('../../dbConfig')
const router = express.Router()

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

// --------------------------------------------------上传文章--------------------------
// 上传文章
router.post('/upload/content',(req,res)=>{
  const sql =  `
  INSERT INTO content ( id, title, content, imgUrl)
  VALUES ( 0, ?, ?, ?)
  `
  const sqlArr = [req.body.title,req.body.content,req.body.avatar]
  query(sql,sqlArr,(err,vals)=>{
    if (err) {
      return res.send({
        status:402,
        message:'上传失败',
        data:err
      })
    }
    res.send({
      status:201,
      message:'上传成功'
    })
  })
})

// 查询最新的三条文章文章
router.get('/select/contents',(req,res)=>{
  const sql = `
  SELECT * FROM content  ORDER BY creat_time DESC LIMIT 3
  `
  query(sql,(err,vals)=>{
    if (err) {
      return res.send({
        status:402,
        message:'查询失败'
      })
    }
    res.send({
      status:201,
      message:'查询成功',
      data:vals
    })
  })
})

// 根绝id查询一篇文章
router.get('/select/content/:id',(req,res)=>{
  console.log(req.params);
  const sql = `select * from content where  id=?`
  const sqlArr = [req.params.id]
  query(sql,sqlArr,(err,vals)=>{
    if (err) {
      return res.send({
        status:402,
        message:'查询失败'
      })
    }
    res.send({
      status:201,
      message:'查询成功',
      data:vals
    })
  })
})

// --------------------------------------------------意见反馈--------------------------
router.post('/feedback',(req,res)=>{
  const arr = req.body
  const imgURL = arr.imgURL.join('+')
  const sql = `INSERT INTO feedback (id,text,imgUrl,creat_time)
      VALUES (0,?,?,?)`
  const sqlArr = [arr.msg, imgURL, arr.creat_time]
  query(sql, sqlArr, (err, vals, fields) => {
      if (err) {
        console.log(err);
          return res.send(err)
      }
      res.send({
          message: '提交成功',
          status: 201
      })
  })
})

router.get('/feedback',(req,res)=>{
    const sql = `select * from feedback`
    query(sql,(err,vals)=>{
      if (err) {
        return res.send({
          status:402,
          data:err,
          message:'获取失败'
        })
      }
      res.send({
        status:201,
        data:vals,
        message:'查询成功'
      })
    })
})

// 删除一条数据
router.delete('/feedback/:id', (req, res) => {
  const sql = `Delete from feedback where id = ${req.params.id}`
  query(sql, (err, data) => {
      if (err) {
          return console.log(err);
      }
      res.send({ status: 201, message: '删除成功' })
  })
})

// 根据id批量删除数据
router.post('/feedbacks', (req, res) => {
  const sql = ` DELETE  from feedback where id in (${req.body.join(',')})`
  query(sql, (err, data) => {
      if (err) {
          return console.log(err);
      }
      res.send({ status: 201 })
  })
})


module.exports = router