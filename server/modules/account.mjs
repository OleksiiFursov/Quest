import usersToken from "../model/usersToken.mjs";
import jwt from "jsonwebtoken";
import config from "../config.mjs";


const ModuleAccount = {
    async createToken(context) {
        const conf = config.jwt;

        const userData = {
            userId: context.state.user_id,
        };
        const token = jwt.sign(userData, conf.secretKey, {expiresIn: conf.expires});
        context.currentUser.token = token;

        const result = await usersToken().insert({
            token,
            user_id: context.state.user_id,
            ip: context.currentUser.ip,
            data: context.currentUser.userAgent,
            date_expires: new Date(Date.now() + (conf.expires*1000))
        });

        return result[0] ? token : null;
    },
    async checkToken(token) {
        return await usersToken().has({token});
    }

}

export default ModuleAccount;
