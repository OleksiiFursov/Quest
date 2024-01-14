import { memo, useEffect } from 'preact/compat'
import { useState } from 'preact/hooks'
import NotificationList from './app/NotificationList.js'
import routes from './app/router.js'
import loaderFormValid from './components/Form/LoaderValid.js'
import Loading from './components/Loading/index.jsx'
import { loaderMessage } from './components/Message/index.jsx'
import createRouter  from './core/Router/index.jsx'
import LoginLayout from './layouts/login/index.jsx'
import DefaultLayout from './layouts/default/index.jsx'
import loaderCurrentUser from "@/app/loaderCurrentUser.js";

const Router = createRouter(routes)

const layouts = {
	'login': LoginLayout,
	'default': DefaultLayout
}

function Init () {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			await Promise.all([
				loaderMessage(),
				loaderFormValid(),
				loaderCurrentUser()
			]);
			setLoading(false);
		})()

	}, [])

	return <>
		<NotificationList/>
		{loading ? <Loading/> : <Router layouts={layouts}/>}
	</>

}

export default memo(Init)
