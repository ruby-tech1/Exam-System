const UserStudent = require('../model/user-student');
const UserAdmin = require('../model/user-teacher');
const {StatusCodes} = require('http-status-codes');
const {UnauthenticatedError, BadRequestError,} = require('../errors/index');


const registerUser = async(req, res) => {
    const user = await UserStudent.create(req.body);
    const token = user.createToken();

    res.status(StatusCodes.CREATED).json({
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        token
    })
}

const registerAdmin = async(req, res) => {
    const user = await UserAdmin.create(req.body);
    const token = user.createToken();

    res.status(StatusCodes.CREATED).json({
        name: user.name,
        email: user.email,
        role: user.role,
        token
    })
}

const loginUser = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError('Please Provide email and password')
    }

    const user = await UserStudent.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createToken();
    res.status(StatusCodes.OK).json({
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        token
    })
}

const loginAdmin = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new BadRequestError('Please Provide email and password')
    }

    const user = await UserAdmin.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createToken();
    res.status(StatusCodes.OK).json({
        name: user.name,
        email: user.email,
        role: user.role,
        token
    })
}

const logoutUser = async(req, res) => {
    res.send("Logout User");
}

const logoutAdmin = async(req, res) => {
    res.send("Logout Admin");
}


module.exports = {
    registerUser,
    registerAdmin,
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
}