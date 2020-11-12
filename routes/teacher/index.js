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
    const sql = `INSERT INTO tea_password (id,account,password_type,section,creat_time)
        VALUES (0,?,?,?,?)`
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
    const sql = `select tea_password.id, name,phone,ID_type,ID_number,department, tea_password.account,password_type,section,tea_password.creat_time 
                from teacher, tea_password
                where teacher.account=tea_password.account 
                order by tea_password.creat_time desc`
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
      order by tea_password.creat_time desc`

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
    console.log(req);
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
    const sql = `INSERT INTO tea_software (id,account,ios,office,time,address,section,phone,text,creat_time)
        VALUES (0,?,?,?,?,?,?,?,?,?)`
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
    text ,tea_software.id
    from teacher, tea_software
    where teacher.account=tea_software.account`
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


// -----------------------------------------虚拟服务器开通服务---------------------------------------------
// 虚拟服务器开通服务
router.post('/teacher/virtual', teaMiddleWare(), (req, res) => {
    const arr = req.body
    const sql = `INSERT INTO tea_virtual (id,account,name,phone,address,section_type,section,cpu,rom,ram,ios,stipulate,creat_time)
        VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?)`
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
    const sql = `select * from tea_virtual`
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
    const sql = `INSERT INTO tea_host (id,account,name,phone,address,section_type,section,cpu,rom,ram,ios,stipulate,creat_time,hosting_type)
        VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?)`
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
    const sql = `select * from tea_host order by creat_time desc`
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
    const sql = `INSERT INTO tea_port (id,account,name,phone,address,section_type,port_number,port_use,section,stipulate,creat_time)
        VALUES (0,?,?,?,?,?,?,?,?,?,?)`
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
    const sql = `select * from tea_port order by creat_time desc`
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
    const sql = `INSERT INTO tea_fault (id,account,phone,address,fault_type,fault_message,section,imgURL,creat_time)
        VALUES (0,?,?,?,?,?,?,?,?)`
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
    const sql = `select tea_fault.id, tea_fault.account,tea_fault.phone,fault_type,address,fault_message,section,teacher.name,tea_fault.creat_time,imgURL 
    from teacher,tea_fault
    where teacher.account = tea_fault.account
    order by tea_fault.creat_time desc
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
    console.log(req);
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

module.exports = router