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

