const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

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
    token: String,
    tokenExp: Number,
})

userSchema.pre('save', function(next){
    var user = this;

    // 비밀번호가 수정될때만
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            
            bcrypt.hash(user.password , salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }
    

})

const User = mongoose.model('User', userSchema)

module.exports = ({User})