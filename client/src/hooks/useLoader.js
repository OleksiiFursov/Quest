import {useState} from "preact/hooks";
import {useEffect} from "preact/compat";

export default function useLoader(calls){
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            await Promise.all(calls)
            setLoading(false);
        })()

    }, []);
    return loading;

}