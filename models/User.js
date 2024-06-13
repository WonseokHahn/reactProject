const Mongoose = require('mongoose')

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
        minlength: 20,
    },
    lastname: {
        type: String,
        minlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: String,
    tokenExp: Number,
})

const User = mongoose.model('User', userSchema)

module.exports = ({User})