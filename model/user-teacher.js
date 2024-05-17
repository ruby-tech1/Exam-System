const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide Name'],
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        match:  [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        , 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide Paswword'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin'
    }
},
{timestamps: true});

adminSchema.pre('save', async function() {
    if(!this.isModified('password')){
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

adminSchema.methods.createToken = function (){
    return jwt.sign(
        {userId: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    )
}

adminSchema.methods.comparePassword = async function (password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

module.exports = mongoose.model('Admin', adminSchema);