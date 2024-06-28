const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');

// schema란 만드는 테이블의 자료형을 지정해주는 것
const userSchema = mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: mongoose.Types.ObjectId, // ObjectId 자동 생성 설정
    //     required: true
    // },
    name:{
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 200,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: Number,
})

// 저장이 되기 전에 사용가능한 몽고DB함수
userSchema.pre('save', function(next){
    var user = this;

    // 비밀번호가 수정될때만 사용 mongoose 함수 
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            
            bcrypt.hash(user.password , salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                // mongoose 함수 
                next()
            })
        })
    }else{
        next()
    }
    

})


userSchema.methods.comparePassword = async function(plainPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, this.password);
        return isMatch;
    } catch (err) {
        throw new Error('비밀번호 비교 중 오류가 발생했습니다.');
    }
};

userSchema.methods.generateToken = async function() {
    try {
        var user = this;

        // jsonwebtoken을 이용해서 token을 생성하기
        var token = jwt.sign({ id: user._id.toHexString() }, 'secretToken');

        // 토큰을 사용자 객체에 저장
        user.token = token;
        
        // 사용자 객체를 데이터베이스에 저장
        await user.save();
        
        // 저장된 사용자 객체 반환
        return user;
    } catch (err) {
        console.error('Error generating token:', err);
        throw err;
    }
}

userSchema.statics.findByToken = async function(token) {
    const user = this;

    try {
        // 토큰을 비동기적으로 검증합니다.
        // callback과 promise에 대해서 자세히 알아보기
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, 'secretToken', (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });
        // 디코딩된 _id와 일치하는 사용자를 찾습니다.
        const foundUser = await user.findOne({
            "_id" : decoded.id,
            "token" : token
        });
        // console.log(foundUser);
        return foundUser; // 찾은 사용자를 반환합니다.
    } catch (err) {
        throw err; // 과정 중 발생한 모든 오류를 처리합니다.
    }
}



const User = mongoose.model('User', userSchema)

module.exports = ({User})