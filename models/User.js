const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');

// schema란 만드는 테이블의 자료형을 지정해주는 것
const userSchema = mongoose.Schema({
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
        maxlength: 20,
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


userSchema.methods.generateToke = function(sb){
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token  = jwt.sign(user._id.toHexString, 'secretToken')


    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

    
}

const User = mongoose.model('User', userSchema)

module.exports = ({User})