const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const {validateRegisterInput, validateLoginInput} = require('../../utils/validators');

const bcrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

function generateToken(user){
	return  jwt.sign({
				id: user.id,
				email: user.email,
				username: user.username
			},
			SECRET_KEY,
			{expiresIn:'1h'}
		);

}
module.exports = {
	Mutation: {
		async login (_, {username, password}) {
			const {errors, valid} = validateLoginInput(username, password);
			if(!valid){
				throw new UserInputError('Wrong',{errors});
			}			
			const user = await User.findOne({username});

			if(!user){
				errors.general = 'User not found';
				throw new UserInputError('User not found',{errors});
			}
			const match = await bcrpt.compare(password, user.password);
			if(!match){
				errors.general = 'Wrong password';
				throw new UserInputError('Wrong password',{errors});
			}

			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token
			};
		},
		async register(
			_,
			{registerInput : {username, email, password,confirmPassword}},
			){
			// 验证用户名和密码
			const { valid, errors} = validateRegisterInput(username, email, password,confirmPassword)
			if(!valid){
				throw new UserInputError('Errors',{ errors });
			}
			// 让我们检查用户名是否已经存在
			const user = await User.findOne({username});	
			if(user){
				throw new UserInputError('Username is taken',{
					errors: {
						username: '用户名已存在'
					}
				});
			}
			// 密码加密和提供token:
			password = await bcrpt.hash(password,12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);
			return {
				...res._doc,
				id: res._id,
				token
			}
		}
	}
}