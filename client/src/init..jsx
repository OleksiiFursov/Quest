import { memo, useEffect } from 'preact/compat'
import NotificationList from './app/NotificationList.js'
import loadFormValid from './components/Form/Valid.js'



function Init(){

	useEffect(() => {
		loadFormValid();
	}, []);

	return <>
		<NotificationList />
	</>

}

export default memo(Init)
