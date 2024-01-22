import config from '../config.js'

export function setState(key, value){
    return prev => {
        prev[key] = value
        return {...prev}
    }
}

export function isDiff(a, b){
    return JSON.stringify(a) !== JSON.stringify(b)
}

export function ucFirst(word){
    return word[0].toUpperCase()+word.slice(1);
}

export function crop(obj, keys){
    const res = {};
    for(const key of keys){
        res[key] = obj[key];
    }
    return res;
}

export function error(msg, obj=[]){
    console.error(msg, obj);
}
export function debounce(func, delay=300) {
    let timerId;

    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
            func.apply(this, args);
            timerId = null;
        }, delay);
    };
}

export function getConfig(path, def={}){
    path = path.split('.');
    let current = config;
    do{
        const item = path.shift();
        current = current[item];
        if(!current) {
            error('Invalid config path "' + path + '"');
            return def;
        }
    }while(path.length);
    return current
}

export function map(obj, call){
    const res = {};
    for(const key in obj){
        res[key] = call(obj[key], key);
    }
    return res;
}

export function setObjectPath(obj, ...params){
    const value = params.pop();
    const property = params.pop();

    let cur = obj;
    for(const path of params){
        if(!cur[path]){
            cur[path] = {};
        }
        cur = cur[path];
    }
    cur[property] = value;
}

