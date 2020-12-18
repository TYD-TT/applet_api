const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const query = require('./dbConfig')

const teacher = require('./routes/teacher/index')
const student = require('./routes/student/index')
const admin = require('./routes/admin/index')
const publi = require('./routes/public/index')
const email = require('./routes/email/index')

// 配置body-parser
// 配置完成后，在req请求对象上会多出一个属性：body
// 可以使用 req.body 来获取表单 POST 请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.engine('art', require('express-art-template'));

// 设置为可跨域
app.use("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
});

// 教师接口
app.use(teacher)
app.use(student)
app.use(admin)
app.use(publi)
app.use(email)

app.use('/uploads', express.static(__dirname + '/uploads'))

// 上传图片
const multer = require('multer')
const upload = multer({ dest: __dirname + '/./uploads' })
// upload.single('file') 代表单个文件的上传
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = `http://127.0.0.1:3000/uploads/${file.filename}`
  res.send({
    status:201,
    data:file.url
  })
})


app.listen(port, () => console.log(`Example app listening on port port!http://127.0.0.1:3000`))
