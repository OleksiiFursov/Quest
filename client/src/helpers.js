export function setState(key, value){
    return prev => {
        console.log(1, JSON.stringify(prev), key)
        prev[key] = value
        return {...prev}
    }
}
