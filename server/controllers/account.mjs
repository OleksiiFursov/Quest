import Resp from '../helpers/Resp.mjs'
import { hashPassword } from '../helpers/password.mjs'
import modelUsers from '../model/users.mjs'

export default {
  get (context, id) {

  },
  async login (context, { username, password }) {
    if(!username){
      return Resp.error('Username is empty');
    }
    if(!username.length < 3){
      return Resp.error('Username is too short');
    }

    if(!password){
      return Resp.error('Password is empty');
    }

    password = hashPassword(password);
    const result =
      modelUsers().has({
        name,
        password,
      });
    console.log(result);
    Resp.success(result);
  },
}
