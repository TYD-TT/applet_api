module.exports = options => {
    const query = require('../dbConfig')
    return (req, res, next) => {
        const sql = `INSERT INTO people_sum (id,people_type,people_account,service_type,creat_time) 
        VALUES (0,?, ?, ?, ?)`
        const sqlArr = [req.body.people_type, req.body.account, req.body.service_type, req.body.creat_time]
        query(sql, sqlArr, (err, vals, fields) => {
            if (err) {
                console.log(err);
                return res.send(err)
            }
        })
        next()
    }
}