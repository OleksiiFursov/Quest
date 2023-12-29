import Resp from '../helpers/Resp.mjs'
import {comparePasswords} from '../helpers/password.mjs'
import modelUsers from '../model/users.mjs'
import ModuleAccount from "../modules/account.mjs";

export default {
  get (context, id) {

  },
  me({store}){
    if(store.token){
      
    }
  },
  async login (context, { username, password }) {

    if(!username){
      return Resp.error('Username is empty');
    }
    if(username.length < 3){
      return Resp.error('Username is too short');
    }

    if(!password){
      return Resp.error('Password is empty');
    }

    const passwordHashed = await modelUsers().column('password', {username});
    if(!passwordHashed){
      return Resp.error('Login or password is not correct');
    }


    if(await comparePasswords(password, passwordHashed)){
      await ModuleAccount.createToken(context)

      return Resp.success(true);
    }else{
      return Resp.error('Login or password is not correct');
    }

  },
}
