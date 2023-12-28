import {parseJSON} from "@crossfox/utils";

const setData = (data, conv) => {
    if(conv){
        if(typeof data === 'object' && data !== null){
            data = '<J>:'+JSON.stringify(data);
        }
    }
    return data;
}

const getData = (value, def) => {
    if(!value) return def;

    if(value.startsWith('<J>:')){
        value = parseJSON(value)
    }
    return value;
}
const Storage = {
    get(key, def=null){
        return getData(localStorage[key], def);
    },
    set(key, data, conv = true){
        localStorage[key] = setData(data, conv);
    },
    remove(key){
        localStorage.removeItem(key);
    }
}

export const Session = {
    get(key, def=null) {
        return getData(sessionStorage[key], def);
    },
    set(key, data, conv){
        sessionStorage[key] = setData(data, conv)
    }
}
export default Storage;