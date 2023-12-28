import {WSS} from '../../main.jsx';
import {capitalize} from "lodash-es";

export default {
    get(url, data){
        const path = url.split('.');
        const lastIndex = path.length-1;
        path[lastIndex] = 'get'+capitalize(path[lastIndex]);
        return WSS.req(path.join('.'), data)
    }
}