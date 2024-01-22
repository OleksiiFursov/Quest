import Resp from '../helpers/Resp.mjs'
import ModelUsers from '../model/users.mjs'

export default {
    async accountCreate_username(context, {value, values}){
        if(value && value.length > 3){
            return Resp.success(await ModelUsers().has({ username: value}))
        }
        return Resp.success(true);
    }

}
