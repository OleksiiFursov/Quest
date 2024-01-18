import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { memo } from 'preact/compat'
import NotificationList from './app/NotificationList.js'
import routes from './app/router.js'
import loaderFormValid from './components/Form/LoaderValid.js'
import Loading from './components/Loading/index.jsx'
import { loaderMessage } from './components/Message/index.jsx'
import createRouter from './core/Router/index.jsx'
import LoginLayout from './layouts/login/index.jsx'
import DefaultLayout from './layouts/default/index.jsx'
import loaderCurrentUser from '@/app/loaderCurrentUser.js'
import useLoader from '@/hooks/useLoader.js'

const Router = createRouter(routes)

const layouts = {
	'login': LoginLayout,
	'default': DefaultLayout,
}

export const userConfig = {
	dateFormat: 'YYYY-MM-DD'
};

function Init () {
	const loading = useLoader([
		loaderMessage(),
		loaderFormValid(),
		loaderCurrentUser(),
	])
	return <>
		<NotificationList/>
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			{loading ? <Loading/> : <Router layouts={layouts}/>}
		</LocalizationProvider>
	</>

}

export default memo(Init)
