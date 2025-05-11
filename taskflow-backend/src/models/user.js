require('dotenv').config()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	}
});

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, { expiresIn: '2d'})
    return token

};

userSchema.methods.validatePassword = async function (passwordByUserInput) {
	const user = this;
	const isPasswordValid = await bcrypt.compare(
		passwordByUserInput,
		user.password
	);
	return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
