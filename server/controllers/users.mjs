import modelUsers from '../model/users.mjs';

export default {
   get(context, id){

   },
   login(context, username, password){
       modelUsers().count()
   }
}
