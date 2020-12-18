// 教师服务接口

const express = require('express')
const query = require('../../dbConfig')
const router = express.Router()
const teaMiddleWare = require('../../middleWare/addMiddleWare')

// -----------------------------------------基本信息--------------------------------------------------
// 查询基本信息
router.get('/teacher/select_message', (req, res) => {
    const sql = `select * from teacher`
    query(sql, (err, vals, fields) => {
        if (err) {
            return console.log(err);
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '获取数据成功',
            data: row,
            status: 201
        })
    })
})

// 查询新进教师
router.get('/teacher/select_newMessage', (req, res) => {
    const nn = new Date();
    var year = nn.getFullYear();
    const sql = `select * from teacher where creat_time LIKE '${year + "%"}'`
    query(sql, (err, vals, fields) => {
        if (err) {
            return console.log(err);
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '获取数据成功',
            data: row,
            status: 201
        })
    })
})

// 添加教师
router.post('/teacher/register', teaMiddleWare(), (req, res) => {
    const sql = `INSERT INTO teacher ( id, name, account, phone, ID_type, ID_number, department, creat_time )
    VALUES ( 0, ?, ?, ?, ?, ?, ?,? )`
    const arr = req.body
    const sqlArr = [arr.name, arr.account, arr.phone, arr.ID_type, arr.ID_number, arr.department, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err)
        }
        res.send({
            message: '添加成功',
            status: 201
        })
    })
})

// 修改老师基本信息
router.put('/teacher/editTeacher/:id', (req, res) => {
    console.log(req);
    const sql = `update teacher 
    set account = ?, name=?, phone=?, ID_type=?, ID_number=?, department=? 
    where id = ?`
    const sqlArr = [req.body.account, req.body.name, req.body.phone, req.body.ID_type, req.body.ID_number, req.body.department, req.body.id]
    query(sql, sqlArr, (err, vals) => {
        if (err) {
            return console.log(err);
        }
        res.send({
            status: 201,
            message: '修改成功'
        })
    })
})

// 教师基本信息按条件查询
router.post('/teacher/find_msg', (req, res) => {
    const sql = `select *
      from teacher 
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

// 教师基本信息——根据id删除一条数据
router.delete('/teacher/del_msg/:id', (req, res) => {
    console.log(req);
    const sql = `Delete from teacher where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})

// 教师基本信息——根据id批量删除数据
router.post('/teacher/del_msg', (req, res) => {
    const sql = ` DELETE  from teacher where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})


// -----------------------------------------修改密码---------------------------------------------------
// 修改密码
router.post('/teacher/password', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_password (id,account,password_type,section,creat_time,status)
        VALUES (0,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.password_type, arr.section, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 查询修改密码的信息
router.get('/teacher/password', (req, res) => {
    const sql = `select tea_password.id, name,phone,ID_type,ID_number,department, tea_password.account,password_type,section,tea_password.creat_time,tea_password.status 
                from teacher, tea_password
                where teacher.account=tea_password.account 
                order by tea_password.time desc`
    query(sql, (err, vals, fields) => {
        if (err) {

            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 教师修改密码按条件查询
router.post('/teacher/find_pwd', (req, res) => {
    var sqlArr = []
    if (req.body.index == 'password_type' || req.body.index == 'creat_time') {
        sqlArr = ['tea_password']
    } else {
        sqlArr = ['teacher']
    }
    const sql = `select tea_password.account,name,password_type,tea_password.section,tea_password.creat_time,phone,ID_number,ID_type
      from teacher,tea_password
      WHERE ${sqlArr}.${req.body.index} LIKE '${"%" + req.body.value + "%"}' AND teacher.account=tea_password.account 
      order by tea_password.time desc`

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

// 教师修改密码——根据id删除一条数据
router.delete('/teacher/del_pwd/:id', (req, res) => {
    const sql = `Delete from tea_password where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})

// 教师修改密码——根据id批量删除数据
router.post('/teacher/del_pwd', (req, res) => {
    const sql = ` DELETE  from tea_password where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})


// -----------------------------------------软件正版化----------------------------------------------------
// 软件正版化
router.post('/teacher/software', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_software (id,account,ios,office,time,address,section,phone,text,creat_time,status)
        VALUES (0,?,?,?,?,?,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.ios, arr.office, arr.time, arr.address, arr.section, arr.phone, arr.text, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 查询软件正版化
router.get('/teacher/software', (req, res) => {
    const arr = req.body
    const sql = `select name,ios,office, address, time, tea_software.account, tea_software.phone,section,tea_software.creat_time,
    text ,tea_software.id,tea_software.status
    from teacher, tea_software
    where teacher.account=tea_software.account
    order by tea_software.time1 desc`
    query(sql, (err, vals, fields) => {
        if (err) {
            console.log(err);
            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 教师软件正版化按条件查询
router.post('/teacher/find_software', (req, res) => {
    var sqlArr = []
    if (req.body.index == 'name') {
        sqlArr = ['teacher']
    } else {
        sqlArr = ['tea_software']
    }
    const sql = `select tea_software.account,name,tea_software.id,tea_software.section,tea_software.creat_time,tea_software.phone,ios,office,time,address
      from teacher,tea_software
      WHERE ${sqlArr}.${req.body.index} LIKE '${"%" + req.body.value + "%"}' AND teacher.account=tea_software.account 
      order by tea_software.creat_time desc`

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

// 教师软件正版化删除一条数据
router.delete('/teacher/del_software/:id', (req, res) => {
    console.log(req);
    const sql = `Delete from tea_software where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
})

// 教师软件正版化——根据id批量删除数据
router.post('/teacher/del_software', (req, res) => {
    const sql = ` DELETE  from tea_software where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})

// 软件正版化评价
router.post('/teacher/appraise', (req, res) => {
    const sql = `
    update tea_software 
    set install_name=?, appraise=?, feedback=?
    where id=${req.body.id}
    `
    const sqlArr = [req.body.install, req.body.value2, req.body.feedback]
    query(sql, sqlArr, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '评论失败',
                data: err
            })
        }
        res.send({
            status: 201,
            message: '评论成功'
        })

    })
})

// -----------------------------------------虚拟服务器开通服务---------------------------------------------
// 虚拟服务器开通服务
router.post('/teacher/virtual', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_virtual (id,account,name,phone,address,section_type,section,cpu,rom,ram,ios,stipulate,creat_time,status)
        VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.name, arr.phone, arr.address, arr.section_type, arr.section, arr.cpu, arr.rom, arr.ram, arr.ios, arr.stipulate, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 虚拟服务器开通服务
router.get('/teacher/virtual', (req, res) => {
    const sql = `select * from tea_virtual order by time desc`
    query(sql, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 教师虚拟服务器开通按条件查询
router.post('/teacher/find_virtual', (req, res) => {
    const sql = `select *
      from tea_virtual
      WHERE ${req.body.index} LIKE '${"%" + req.body.value + "%"}'
      order by creat_time desc`

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

// 教师虚拟服务器开通删除一条数据
router.delete('/teacher/del_virtual/:id', (req, res) => {
    console.log(req);
    const sql = `Delete from tea_virtual where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
})

// 教师虚拟服务器开通——根据id批量删除数据
router.post('/teacher/del_virtual', (req, res) => {
    const sql = ` DELETE  from tea_virtual where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})


// -----------------------------------------托管服务器开通服务---------------------------------------------
// 托管服务器开通服务
router.post('/teacher/hosting', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_host (id,account,name,phone,address,section_type,section,cpu,rom,ram,ios,stipulate,creat_time,hosting_type,status)
        VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.name, arr.phone, arr.address, arr.section_type, arr.section, arr.cpu, arr.rom, arr.ram, arr.ios, arr.stipulate, arr.creat_time, arr.hosting_type]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 托管服务器开通服务
router.get('/teacher/hosting', (req, res) => {
    const sql = `select * from tea_host order by time desc`
    query(sql, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 教师托管服务器开通按条件查询
router.post('/teacher/find_hosting', (req, res) => {
    const sql = `select *
      from tea_host
      WHERE ${req.body.index} LIKE '${"%" + req.body.value + "%"}'
      order by creat_time desc`

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

// 教师托管服务器开通删除一条数据
router.delete('/teacher/del_hosting/:id', (req, res) => {
    console.log(req);
    const sql = `Delete from tea_host where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
})

// 教师托管服务器开通——根据id批量删除数据
router.post('/teacher/del_hosting', (req, res) => {
    const sql = ` DELETE  from tea_host where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})


// -----------------------------------------教学区端口开通服务---------------------------------------------
// 教学区端口开通服务
router.post('/teacher/port', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_port (id,account,name,phone,address,section_type,port_number,port_use,section,stipulate,creat_time,status)
        VALUES (0,?,?,?,?,?,?,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.name, arr.phone, arr.address, arr.section_type, arr.port_number, arr.port_use, arr.section, arr.stipulate, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 教学区端口开通服务
router.get('/teacher/port', (req, res) => {
    const sql = `select * from tea_port order by time desc`
    query(sql, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 教学区端口开通按条件查询
router.post('/teacher/find_port', (req, res) => {
    const sql = `select *
      from tea_port
      WHERE ${req.body.index} LIKE '${"%" + req.body.value + "%"}'
      order by creat_time desc`

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

// 教学区端口开通删除一条数据
router.delete('/teacher/del_port/:id', (req, res) => {
    console.log(req);
    const sql = `Delete from tea_port where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
})

// 教学区端口开通——根据id批量删除数据
router.post('/teacher/del_port', (req, res) => {
    const sql = ` DELETE  from tea_port where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})


// -----------------------------------------网络故障上报服务---------------------------------------------
// 网络故障上报服务
router.post('/teacher/fault', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const imgURL = arr.imgURL.join('+')
    const sql = `INSERT INTO tea_fault (id,account,phone,address,fault_type,fault_message,section,imgURL,creat_time,status)
        VALUES (0,?,?,?,?,?,?,?,?,-1)`
    const sqlArr = [arr.account, arr.phone, arr.address, arr.fault_type, arr.fault_message, arr.section, imgURL, arr.creat_time]
    query(sql, sqlArr, (err, vals, fields) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            message: '提交成功',
            status: 201
        })
    })
})

// 网络故障报修
router.get('/teacher/fault', (req, res) => {
    const sql = `select tea_fault.id, tea_fault.account,tea_fault.phone,fault_type,address,fault_message,section,teacher.name,tea_fault.creat_time,imgURL,tea_fault.status 
    from teacher,tea_fault
    where teacher.account = tea_fault.account
    order by tea_fault.time desc
    `
    query(sql, (err, vals, fields) => {
        if (err) {
            console.log(err);
            return res.send(err)
        }
        const row = JSON.stringify(vals)
        res.send({
            message: '查询成功',
            data: row,
            status: 201
        })
    })
})

// 网络故障报修按条件查询
router.post('/teacher/find_fault', (req, res) => {
    var sqlArr = []
    if (req.body.index == 'name') {
        sqlArr = ['teacher']
    } else {
        sqlArr = ['tea_fault']
    }
    const sql = `select tea_fault.id, tea_fault.account,tea_fault.phone,fault_type,address,fault_message,section,teacher.name,tea_fault.creat_time,imgURL 
    from teacher,tea_fault
      WHERE ${sqlArr}.${req.body.index} LIKE '${"%" + req.body.value + "%"}' AND teacher.account=tea_fault.account 
      order by tea_fault.creat_time desc`
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

// 网络故障报修删除一条数据
router.delete('/teacher/del_fault/:id', (req, res) => {
    const sql = `Delete from tea_fault where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
})

// 网络故障报修——根据id批量删除数据
router.post('/teacher/del_fault', (req, res) => {
    const sql = ` DELETE  from tea_fault where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
})

// -----------------------------------------查询申请任务---------------------------------------------
router.get('/teacher/steps', (req, res) => {
    if (req.query.api == 'tea_software') {
        var sql = `select * from ${req.query.api} where account=? order by time1 desc`
    } else {
        var sql = `select * from ${req.query.api} where account=? order by time desc`
    }

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
router.post('/teacher/step', (req, res) => {
    const sql = `select * from ${req.body.type} where id=?`
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

// -----------------------------------------VSB网站群技术支持-----------------------------------------
router.post('/teacher/advisory',(req,res)=>{
    const arr = req.body
    const imgURL = arr.imgURL.join('+')
    const sql = `INSERT INTO tea_advisory (id,account,text,imgURL,creat_time)
        VALUES (0,?,?,?,?)`
    const sqlArr = [arr.account, arr.msg, imgURL, arr.creat_time]
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

router.get('/teacher/advisory',(req,res)=>{
    const sql = `
    select name, tea_advisory.account, text, tea_advisory.creat_time, imgURL,tea_advisory.id
    from teacher, tea_advisory
    where teacher.account=tea_advisory.account
    `
    query(sql,(err,vals)=>{
        if (err) {
            console.log(err);
            return res.send({
                status:402,
                message:'查询失败',
                data:err
            })
        }
        res.send({
            status:201,
            message:'查询成功',
            data:vals
        })
    })
})

// 删除一条数据
router.delete('/teacher/advisory/:id', (req, res) => {
    const sql = `Delete from tea_advisory where id = ${req.params.id}`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201, message: '删除成功' })
    })
  })
  
  // 根据id批量删除数据
  router.post('/teacher/advisories', (req, res) => {
    const sql = ` DELETE  from tea_advisory where id in (${req.body.join(',')})`
    query(sql, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.send({ status: 201 })
    })
  })
  

// -----------------------------------------教师首页数据分析-------------------------------------------
// 密码修改
router.get('/teacher/select_pwd', (req, res) => {
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
    const sql = `select DISTINCT  tea_password.id, teacher.name, tea_password.account,tea_password.status,tea_password.creat_time,tea_password.password_type
    from teacher,people_sum,tea_password
    where tea_password.time LIKE '${"%" + time + "%"}'
    AND teacher.account = people_sum.people_account
    AND teacher.account = tea_password.account
    AND tea_password.creat_time = people_sum.creat_time
    AND people_sum.service_type = 'pwd'
    AND people_type='teacher'
    order by tea_password.status, tea_password.time desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 改变教师申请的状态（未审核->审核中）
router.post('/teacher/edit_status', (req, res) => {
    if (req.body.status < 1) {
        const sql = `
    update ${req.body.sql_type} 
    SET status = ${Number(req.body.status) + 1}
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
                message: '审核中'
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

// 软件正版化
router.get('/teacher/select_sfw', (req, res) => {
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
    const sql = `select DISTINCT  tea_software.id, teacher.name, tea_software.account,tea_software.status,tea_software.creat_time
    from teacher,people_sum,tea_software
    where tea_software.time1 LIKE '${"%" + time + "%"}'
    AND teacher.account = people_sum.people_account
    AND teacher.account = tea_software.account
    AND tea_software.creat_time = people_sum.creat_time
    AND people_sum.service_type = 'software'
    AND people_type='teacher'
    order by tea_software.status, tea_software.time1 desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 虚拟服务器
router.get('/teacher/select_virtual', (req, res) => {
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
    const sql = `select DISTINCT  tea_virtual.id, name, tea_virtual.account,tea_virtual.status,tea_virtual.creat_time
    from people_sum,tea_virtual
    where tea_virtual.time LIKE '${"%" + time + "%"}'
    AND tea_virtual.account = people_sum.people_account
    AND tea_virtual.creat_time = tea_virtual.creat_time
    AND people_sum.service_type = 'virtual'
    AND people_type='teacher'
    order by tea_virtual.status, tea_virtual.time desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 服务器托管
router.get('/teacher/select_host', (req, res) => {
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
    const sql = `select DISTINCT  tea_host.id, name, tea_host.account,tea_host.status,tea_host.creat_time
    from people_sum,tea_host
    where tea_host.time LIKE '${"%" + time + "%"}'
    AND tea_host.account = people_sum.people_account
    AND tea_host.creat_time = people_sum.creat_time
    AND people_sum.service_type = 'host'
    AND people_type='teacher'
    order by tea_host.status, tea_host.time desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 开通端口
router.get('/teacher/select_port', (req, res) => {
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
    const sql = `select DISTINCT  tea_port.id, name, tea_port.account,tea_port.status,tea_port.creat_time
    from people_sum,tea_port
    where tea_port.time LIKE '${"%" + time + "%"}'
    AND tea_port.account = people_sum.people_account
    AND tea_port.creat_time = people_sum.creat_time
    AND people_sum.service_type = 'port'
    AND people_type='teacher'
    order by tea_port.status, tea_port.time desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 网络故障
router.get('/teacher/select_fault', (req, res) => {
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
    const sql = `select DISTINCT  tea_fault.id, teacher.name, tea_fault.account,tea_fault.status,tea_fault.creat_time
    from teacher,people_sum,tea_fault
    where tea_fault.time LIKE '${"%" + time + "%"}'
    AND teacher.account = people_sum.people_account
    AND teacher.account = tea_fault.account
    AND tea_fault.creat_time = people_sum.creat_time
    AND people_sum.service_type = 'fault'
    AND people_type='teacher'
    order by tea_fault.status, tea_fault.time desc`
    query(sql, (err, vals) => {
        if (err) {
            console.log(err);
            return res.send({
                status: 402,
                message: '获取数据失败'
            })
        }
        res.send({
            status: 201,
            data: vals,
            message: '获取数据成功'
        })
    })
})

// 教师查询一周内的数据变化
router.get('/teacher/select_sum', (req, res) => {
    const sql = `
    SELECT * FROM ${req.query.sql_tyep} 
    WHERE YEARWEEK(date_format(creat_time,'%Y-%m-%d'),1) = YEARWEEK(now(),1);`
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

// 点击完成改变状态
router.post('/teacher/edit_status1', (req, res) => {
    if (req.body.status < 1) {
        const sql = `
      update ${req.body.sql_type} 
      SET status = ${0+req.body.status+1}
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

module.exports = router
