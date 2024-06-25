// 시작점
// express를 다운받았기 때문에 가져올 수 있음
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const mongoose = require('mongoose')
const auth = require('./middleware/auth')

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

// 회원가입용 controller
app.post('/api/users/register', (req, res) => {
  
  // 회원가입할 때 필요한 정보들을 Client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)
  
  // 몽고DB에서 사용하는 save 함수
  // async 함수 선언
  async function saveUser(req, res) {
    try {
     // user.save()는 프로미스를 반환합니다.
     // save 함수가 더이상 콜백하지 않습니다.
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

// 로그인용 controller
app.post('/api/users/login', async (req, res) => {
  try {
    // findOne 함수는 더이상 콜백을 지원하지 않습니다.
    const userInfo = await User.findOne({email: req.body.email});
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    const isMatch = await userInfo.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다."
      });
    }

    const user = userInfo.generateToken();

    // 토큰은 쿠키, 로컬스토리지 등에 저장할 수 있음
    res.cookie("x_auth", user.token)
       .status(200)
       .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});


// role이 0이면 일반 유저 1이면 어드민
app.get('/api/users/auth' , auth , (req, res) => {
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastnamename,
    role: req.user.role,
    image: req.user.image,
  })
})


// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect(); // 연결 재시도
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

