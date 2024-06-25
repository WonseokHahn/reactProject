const {User} = require('../models/User')


let auth = (req, res, next) => {
    // 인증처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 복호화 시키고 userID를 찾아서 DB에서 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    });

    // 유저 있으면 인증 O

    // 유저 없으면 인증 X

}

module.exports = { auth };