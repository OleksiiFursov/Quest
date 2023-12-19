import modelUsers from '../model/users.mjs';

export default {
   get(context, id){

   },
   login(context, {login, password}){

      return modelUsers().has({
        username:
      })
   }
}
