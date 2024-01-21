import {memo} from 'preact/compat'
import NotificationList from './app/NotificationList.jsx'
import routes from './app/router.js'
import loaderFormValid from './components/Form/LoaderValid.js'
import Loading from './components/Loading/index.jsx'
import {loaderMessage} from './components/Message/index.jsx'
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

function Init() {
    const loading = useLoader([
        loaderMessage(),
        loaderFormValid(),
        loaderCurrentUser(),
    ])
    return <>
        <NotificationList/>
        {loading ? <Loading/> : <Router layouts={layouts}/>}
    </>

}

export default memo(Init)
