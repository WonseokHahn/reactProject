// 시작점
// express를 다운받았기 때문에 가져올 수 있음
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const {User} = require("./models/User")
const mongoose = require('mongoose')

// 실서버, 개발서버에서 사용될 값을 나눠놓음
const config = require('./config/key')

// 오는 정보를 서버에서 제대로 가져올 수 있게 
app.use(bodyParser.urlencoded({extended: true}))

// application/json 형태로 되어있는 것 분석할 수 있게 
app.use(bodyParser.json())

const dbURI = config.mongoURI

mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.error('MongoDB Connection Error:', err))


app.get('/', (req, res) => {
  res.send('ㅎㅇㅎㅇ 반가워 구라임~')

})

// 들어갈 값 endPoint
app.post('/register', (req, res) => {
  
  // 회원가입할 때 필요한 정보들을 Client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)
  
  // 몽고DB에서 사용하는 save 함수
  // async 함수 선언
  async function saveUser(req, res) {
    try {
     // user.save()는 프로미스를 반환합니다.
     const doc = await user.save();
     return res.status(200).json({
       success: true
      });
    } catch (err) {
     return res.json({ success: false, err });
    }
  }

  // saveUser 함수 호출
  saveUser(req, res);

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

