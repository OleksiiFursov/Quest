import usersToken from "../model/usersToken.mjs";

const ModuleAccount = {
    async createToken(context){
        console.log(context);
        const result = await usersToken().insert({
            token: 1,


        })
    }

}

export default ModuleAccount;
