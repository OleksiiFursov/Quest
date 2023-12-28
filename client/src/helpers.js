export function setState(key, value){
    return prev => {
        prev[key] = value
        return {...prev}
    }
}