// 시작점
// express를 다운받았기 때문에 가져올 수 있음
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const mongoose = require('mongoose')
const {auth} = require('./middleware/auth')

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

// cookie파싱하는 것 이 앱에서 사용
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('ㅎㅇㅎㅇ 반가워 구라임~')

})

// 회원가입용 controller
app.post('/api/users/register', async (req, res) => {
  
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

    const user = await userInfo.generateToken();

    // 토큰은 쿠키, 로컬스토리지 등에 저장할 수 있음
    res.cookie("x_auth", user.token)
       .status(200)
       .json({ loginSuccess: true, userId: user._id , token: user.token});
  } catch (err) {
    console.log(err);

    return res.status(400).send(err);
  }
});


// role이 0이면 일반 유저 1이면 어드민
app.get('/api/users/auth' , auth , async (req, res) => {
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



// 로그아웃 API 정의 (async/await 사용)
app.get('/api/users/logout', auth, async (req, res) => {
  try {
      // 유저의 토큰을 비워줌
      const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { token: "" } },
          { new: true } // 업데이트된 문서를 반환받기 위해 옵션 추가
      );

      if (!updatedUser) {
          return res.json({ success: false, message: "로그아웃 실패: 사용자를 찾을 수 없습니다." });
      }

      return res.status(200).send({
          success: true,
          message: "로그아웃 성공"
      });
  } catch (err) {
      return res.json({ success: false, err });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

