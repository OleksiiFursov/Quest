import usersAttempt from '#model/usersAttempt.js'
import Resp from '../helpers/Resp.mjs'
import {comparePasswords} from '../helpers/password.mjs'
import modelUsers from '../model/users.mjs'
import ModuleAccount from "../modules/account.mjs";
import { getConfig } from '../tools.mjs'

export default {
    get(context, id) {

    },
    me({state}) {
        if (state.token) {

        }
    },
    async checkToken(context, token){
        console.log(ModuleAccount.checkToken(context, token));
    },
    async login(context, {username, password}) {

        console.log(1);
        if (!username) {
            return Resp.error('Username is empty');
        }
        if (username.length < 3) {
            return Resp.error('Username is too short');
        }

        const confAttempt = getConfig('login.attempt');

        if(await usersAttempt().count({
            date_created: '``NOW()-'+confAttempt.duration
        }) > confAttempt.limit){
            return Resp.error('Too many failed authorization attempts have been made', 403)
        }

        if (!password) {
            return Resp.error('Password is empty');
        }

        const userCurrent = await modelUsers().findOne({username});
        if (!userCurrent) {
            return Resp.error('Login or password is not correct');
        }
        if (await comparePasswords(password, userCurrent.password)) {
            context.state.user_id = userCurrent.id
            const token = await ModuleAccount.createToken(context);
            delete userCurrent.password

            if (token) {
                return Resp.success({
                    token,
                    ...userCurrent
                })
            } else {
                return Resp.error('Failed to create token');
            }

        } else {
            usersAttempt().insert({
                username,
                ip: context.currentUser.ip,
                user_agent: context.currentUser.userAgent,
            });
            return Resp.error('Login or password is not correct');
        }
    },
}
