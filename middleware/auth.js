const {User} = require('../models/User')


let auth = async (req, res, next) => {
    // 클라이언트 쿠키를 들고옴
    let token = req.cookies.x_auth;

    try {
        const user = await User.findByToken(token);
        console.log(user);
        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        throw err;
    }
};

module.exports = { auth };