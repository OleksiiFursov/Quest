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
