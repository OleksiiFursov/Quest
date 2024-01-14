import usersAttempt from '#model/usersAttempt.js'
import {dateNow, lastQuery} from '../db.js'
import Resp from '../helpers/Resp.mjs'
import { comparePasswords } from '../helpers/password.mjs'
import modelUsers from '../model/users.mjs'
import ModuleAccount from '../modules/account.mjs'
import { getConfig } from '../tools.js'
import usersToken from "#model/usersToken.mjs";
import users from "#schemas/users.js";

export default {
	get (context, id) {

	},
	async me (context, { token }) {
		const confExpires = getConfig('login.token.expires');
		if (token) {
			context.state.token = token;
			const id = await usersToken().column('user_id',{token, date_expires: {'>':dateNow(-confExpires)}});
			if(!id){
				return Resp.error('Token not found',403);
			}else{
				const currentUser = await users().findOne({id});
				if(!currentUser){
					return Resp.error('Not found user',404);
				}else{
					return Resp.success(currentUser);
				}

			}

		}
	},
	async checkToken (context, token) {
		console.log(ModuleAccount.checkToken(context, token))
	},

	_loginAttempt (context, username, error) {
		usersAttempt().insert({
			username,
			ip: context.currentUser.ip,
			user_agent: context.currentUser.userAgent,
		});
		return Resp.error(error)
	},
	async login (context, { username, password }) {
		//console.log(sendMail('nodepro777@gmail.com', 'test', 'node forever'));

		// if (!captcha) {
		// 	return Resp.error('Bad captcha');
		// }
		// console.log(await createAssessment(captcha));

		const confAttempt = getConfig('login.attempt');

		const countAttempt = await usersAttempt().count({
			date_created: {'>':dateNow(-confAttempt.duration)},
			username,
		})

		if (countAttempt >= confAttempt.limit) {
			return Resp.error('Many unsuccessful login attempts have been made, please try again later.', 403)
		}

		// IS EMPTY:
		if (!username) {
			return this._loginAttempt(context, username,'Username is empty');
		}
		if (!password) {
			return this._loginAttempt(context, username,'Password is empty')
		}

		//CHECK ENABLED CAPTCHA
		const isEnabledCaptcha = countAttempt >= confAttempt.enableCaptcha

		if (isEnabledCaptcha) {
			context.emit('login.enableCaptcha', true)
		}

		// CHECK USERNAME:
		if (username.length < 3) {
			return this._loginAttempt(context, username,'Username is too short')
		}
		const userCurrent = await modelUsers().findOne({ username })
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