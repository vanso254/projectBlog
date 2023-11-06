const mongoose=require('mongoose')
const bcrypt = require('bcrypt')
const BcryptSalt = require('bcrypt-salt')
const bs = new BcryptSalt()
const saltRounds = bs.saltRounds >= 10 ? bs.saltRounds : 10

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

module.exports = mongoose.model('User', userSchema)