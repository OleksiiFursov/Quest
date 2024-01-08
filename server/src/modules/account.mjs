import { createToken, getConfig } from '#tools.mjs'
import usersToken from "../model/usersToken.mjs";


const ModuleAccount = {
    async createToken(context) {
        const conf = getConfig('login.token');

        const token = createToken(conf.length);
        context.currentUser.token = token;

        const result = await usersToken().insert({
            token,
            user_id: context.state.user_id,
            ip: context.currentUser.ip,
            user_agent: context.currentUser.userAgent,
            date_expires: new Date(Date.now() + (conf.expires*1000))
        });

        return result[0] ? token : null;
    },
    async checkToken(token) {
        return await usersToken().has({token});
    }

}

export default ModuleAccount;
