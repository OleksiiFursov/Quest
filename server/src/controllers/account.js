import ModelUsersAttempt from '#model/usersAttempt.js'
import {dateNow} from '../db.js'
import Resp from '../helpers/Resp.mjs'
import { comparePasswords } from '../helpers/password.mjs'
import ModuleAccount from '../modules/account.mjs'
import getValidate from '../modules/formValid/formValid.js'
import { getConfig } from '../tools.js'
import ModelUsersToken from "#model/usersToken.mjs";
import ModelUsers from "#schemas/users.js";
import FormValidUserLogin from "../modules/formValid/form/accountLogin.js"

export default {
	get (context, id) {

	},
	async me (context, { token }) {
		const confExpires = getConfig('login.token.expires');
		if (token) {
			context.state.token = token;
			const id = await ModelUsersToken().column('user_id',{token, date_expires: {'>':dateNow(-confExpires)}});
			if(!id){
				return Resp.error('Token not found',403);
			}else{
				const currentUser = await ModelUsers().findOne({id});
				if(!currentUser){
					return Resp.error('Not found user',404);
				}else{
					return Resp.success(currentUser);
				}
			}
		}
	},
	_loginAttempt (context, username, error) {
		ModelUsersAttempt().insert({
			username,
			ip: context.currentUser.ip,
			user_agent: context.currentUser.userAgent,
		});
		return Resp.error(error)
	},
	async login (context, values) {
		//console.log(sendMail('nodepro777@gmail.com', 'test', 'node forever'));

		// if (!captcha) {
		// 	return Resp.error('Bad captcha');
		// }
		// console.log(await createAssessment(captcha));
		const {username, password} = values;

		const confAttempt = getConfig('login.attempt');

		const countAttempt = await ModelUsersAttempt().count({
			date_created: {'>':dateNow(-confAttempt.duration)},
			username,
		});

		if (countAttempt >= confAttempt.limit) {
			return Resp.error('Many unsuccessful login attempts have been made, please try again later.', 403)
		}


		for(const key of ['username', 'password']){
			let errorMessage = getValidate(values[key], FormValidUserLogin[key], values);
			if(errorMessage){
				return this._loginAttempt(context, username, errorMessage);
			}

		}

		//CHECK ENABLED CAPTCHA
		const isEnabledCaptcha = countAttempt >= confAttempt.enableCaptcha

		if (isEnabledCaptcha) {
			context.emit('login.enableCaptcha', true)
		}

		const userCurrent = await ModelUsers().findOne({ username })
		if (!userCurrent) {
			return this._loginAttempt(context, username,'Login or password is not correct')
		}



		if (await comparePasswords(password, userCurrent.password)) {
			context.state.user_id = userCurrent.id;

			const token = await ModuleAccount.createToken(context)
			delete userCurrent.password

			if (token) {
				context.emit('login.captcha', false);
				context.state.token = token;
				return Resp.success({
					token,
					...userCurrent,
				})
			} else {
				return Resp.error('Failed to create token')
			}

		} else {
			return this._loginAttempt(context, username,'Login or password is not correct')
		}
	},
}
