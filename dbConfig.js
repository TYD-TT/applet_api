const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit : 1000,
    host: 'localhost',
    user: 'root',
    password: 'tyd970420',
    database: 'wx_app',
    port: 3306
  })

var query = function (sql,sqlArr, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            const date = new Date()
            console.log(date);
            callback(err, null, null);
        } else {
            conn.query(sql,sqlArr, function (qerr, vals, fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr, vals, fields);
            });
        }
    });
};

module.exports = query;