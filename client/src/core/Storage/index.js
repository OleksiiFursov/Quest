import {parseJSON} from "@crossfox/utils";

const setData = (data, conv) => {
    if (conv && typeof data === 'object' && data !== null) {
        data = '<J>:' + JSON.stringify(data);
    }
    return data;
}

const getData = (value, def) => {
    if (!value) return def;

    if (value.startsWith('<J>:')) {
        value = parseJSON(value.slice(4))
    }
    return value;
}
const Storage = {
    get(key, def = null) {
        return getData(localStorage[key], def);
    },
    set(key, data, conv = true) {
        localStorage[key] = setData(data, conv);
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}

export const Session = {
    get(key, def = null) {
        return getData(sessionStorage[key], def);
    },
    set(key, data, conv = true) {
        sessionStorage[key] = setData(data, conv)
    }
}
export default Storage;