require('dotenv').config()
const { User } = require("../models/user");
const jwt = require('jsonwebtoken')

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token){
            return res.status(400).send('Invalid credentials!')
        }
        const decodedObj = await jwt.verify(token, process.env.SECRET_KEY)
        const { _id } = decodedObj;
        const user = await User.findById(_id)
        if(!user){
            return res.status(400).send('User not found!')
        }
        req.user = user;
        next();
    } catch(err) {
        console.log("ERORR: ", err.message)
        res.status(400).send(err.message)
    }
}

module.exports = { userAuth }