import { useEffect } from 'preact/compat'

export default function useEventSocket(name, method, check=false){
	useEffect(() => {
		WSS.on(name, method, check);
		return () => WSS.off(name, method);
	}, []);
}
