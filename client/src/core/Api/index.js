import { ucFirst } from '../../helpers.js'
import {WSS} from '../../main.jsx';


export default {
    get(url, data){
        const path = url.split('/');
        const lastIndex = path.length-1;
        path[lastIndex] = 'get'+ucFirst(path[lastIndex]);
        return WSS.req(path.join('/'), data)
    },
    send(url, data){
        return WSS.req(url, data)
    }
}
