import Storage from "@/core/Storage/index.js";
import api from "@/core/Api/index.js";
import {setCurrentUser} from "@/app/actions.js";
import {goTo} from "@/core/Router/index.jsx";
import notification from "@/components/Notification/index.jsx";

export default async function loaderCurrentUser(){
    const token = Storage.get('token');
    if(token){
        const [status, data] = await api.send('account/me', {token});
        if(status === 200){
            setCurrentUser(data);
        }else if(status === 403 || status === 404){
            goTo('account/login');
        }else{
            notification.error('Error');
        }
    }
    return {}
}
