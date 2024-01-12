import { memo, useEffect } from 'preact/compat'
import { useState } from 'preact/hooks'
import NotificationList from './app/NotificationList.js'
import routes from './app/router.js'
import loadFormValid from './components/Form/LoaderValid.js'
import Loading from './components/Loading/index.jsx'
import { loaderMessage } from './components/Message/index.jsx'
import createRouter from './core/Router/index.jsx'
import LoginLayout from './layouts/login/index.jsx'

const Router = createRouter(routes)

const layouts = {
	'login': LoginLayout,
}

function Init () {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			await loaderMessage();
			await loadFormValid();

			setLoading(false);
		})()

	}, [])

	return <>
		<NotificationList/>
		{loading ? <Loading/> : <Router layouts={layouts}/>}
	</>

}

export default memo(Init)
